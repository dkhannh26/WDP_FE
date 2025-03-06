import { CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeOutlined, TruckOutlined } from "@ant-design/icons";
import { Button, Image, List, Space, Table, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { cancelOrder, getListDoneOrder, getListOrder, getListOrderDetail, getListPendingOrder, getOrderDetails, shippedOrder } from "../../services/order.service";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_PATH, PATH } from "../../config/api.config";
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";
const { Text, Title } = Typography;

const OrderCustomer = () => {
    const [status, setStatus] = useState("pending");
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [allOrderDetails, setAllOrderDetails] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate();


    const onChange = (e) => {
        const value = e.target.value.toLowerCase();
        const allItems = Object.values(allOrderDetails).flat();
        const filtered = orders.filter((order) => {
            const relatedOrderDetails = allItems.filter((item) =>
                item.order_id === order._id
            );
            return relatedOrderDetails.some((detail) =>
                detail.product_name.toLowerCase().includes(value)
            );
        });
        console.log('1', allItems);
        console.log('2', orders);
        setFilteredOrders(filtered);
    };
    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => index + 1,
            width: '5%',
        },
        {
            title: 'Day',
            dataIndex: 'createdAt',
            width: '10%',
            render: (text) => new Date(text).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: '20%',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            width: '20%',
        },
        {
            title: 'Total',
            dataIndex: 'total_price',
            sorter: (a, b) => a.total_price - b.total_price,
            width: '10%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
            sorter: (a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
            },
        },
        {
            title: 'Action',
            dataIndex: '_id',
            render: (_id, record) => {
                return (
                    <Space>
                        {record.status === 'delivered' && (
                            <>
                                <Button shape="round" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => cancelOrder(_id, messageApi,
                                    () => getListDoneOrder(initialValues.userId, (data) => {
                                        setOrders(data);
                                        setFilteredOrders(data);
                                    }),
                                    setOrders, setFilteredOrders)}>
                                </Button>
                                <Button shape="round" icon={<CheckOutlined style={{ color: 'green' }} />} onClick={() => shippedOrder(_id, messageApi,
                                    () => getListDoneOrder(initialValues.userId, (data) => {
                                        setOrders(data);
                                        setFilteredOrders(data);
                                    }),
                                    setOrders, setFilteredOrders)}></Button>
                            </>
                        )}
                    </Space>
                )
            },
            width: '10%',
        },
    ];

    const toggleExpand = (id) => {
        const newExpandedRowKeys = expandedRowKeys.includes(id)
            ? expandedRowKeys.filter((key) => key !== id)
            : [...expandedRowKeys, id];
        setExpandedRowKeys(newExpandedRowKeys);

        if (!orderDetails[id]) {
            getOrderDetails(id, (details) => {
                setOrderDetails((prev) => ({ ...prev, [id]: details }));
            });
        }
    };

    const expandedRowRender = (record) => {
        const details = orderDetails[record._id];
        console.log(details);
        if (!details || details.length === 0) return null;
        return (
            <>
                <List
                    header={
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20 }}>
                            <div style={{ textAlign: 'right', fontSize: 20, color: 'gray' }}>
                                <TruckOutlined style={{ marginRight: 10 }} />
                                {status === "pending" ? "Pending" : "Successful delivery"}
                            </div>
                        </div>
                    }
                    footer={
                        <div style={{ textAlign: 'right', fontSize: 20, display: 'flex', justifyContent: 'flex-end' }}>
                            <p style={{ margin: 0 }}><b style={{ marginRight: 10 }}>Total:</b> <span style={{ color: 'red', fontWeight: 'bold' }}>{record.total_price.toLocaleString()}đ</span></p>
                        </div>
                    }

                    itemLayout="horizontal"
                    dataSource={details}
                    bordered
                    style={{ marginBottom: 10 }}
                    renderItem={(item) => {
                        return (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        item.image ? (
                                            <Image width={180} height={200} src={`${API_PATH.image}/${item.product_id}/${item.image}`} />
                                        ) : (
                                            <Image width={180} height={200} src="" />
                                        )
                                    }
                                    title={`${item.product_name} - Size: ${item.product_size_name ? item?.product_size_name : "Không có kích thước"}`}
                                    description={`x${item.cartQuantity}`}
                                    onClick={() => navigate(`/customer/product/${item.product_id}`)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <Title level={4}><del>{(item?.price * item?.cartQuantity).toLocaleString()}đ</del><span style={{ color: 'red' }}>{((item?.price - (item?.price * (item.discount / 100))) * item?.cartQuantity).toLocaleString()}đ</span></Title>

                            </List.Item>
                        )
                    }}
                />
            </>
        );
    };
    const {
        isAuthenticated,
        user,
    } = useAuth();

    const [initialValues, setInitialValues] = useState({
        userId: "",
        username: "",
        email: "",
        phone: "",
        address: "",
    });
    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated) {
                try {
                    const res = await axios.get(`${PATH.profile}/${user.username}`);
                    setInitialValues({
                        userId: res.data.user._id,
                        username: res?.data?.user?.username,
                        email: res?.data?.user?.email,
                        phone: res?.data?.user?.phone,
                        address: res?.data?.user?.address,
                    });
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [isAuthenticated]);
    useEffect(() => {
        if (!initialValues.userId) return;
        getListOrderDetail(initialValues.userId, setAllOrderDetails);
        const fetchOrders = async () => {
            if (status === "pending") {
                getListPendingOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                });
            } else if (status === "done") {
                getListDoneOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                });
            }
        };
        fetchOrders();
    }, [status, initialValues.userId]);
    console.log('details', allOrderDetails);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div style={{ justifyContent: 'center', display: 'flex', margin: '1%' }}>
                <Button onClick={() => setStatus("pending")} type={status === "pending" ? "primary" : "default"} style={{ marginRight: '1%' }}>
                    Pending
                </Button>
                <Button onClick={() => setStatus("done")} type={status === "done" ? "primary" : "default"}>
                    Done
                </Button>
            </div>
            <Search
                placeholder="Enter something to search"
                allowClear
                enterButton
                size="large"
                onChange={onChange}
                style={{
                    width: 350,
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "10px",
                    marginLeft: "16%"
                }}
            />
            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="_id"
                expandable={{
                    expandIcon: ({ onExpand, expanded, record }) => (
                        <Button
                            shape="round"
                            icon={expanded ? <EyeOutlined style={{ color: 'blue' }} /> : <EyeInvisibleOutlined />}
                            onClick={() => {
                                onExpand(record);
                            }}
                        />
                    ),
                    expandedRowRender: expandedRowRender,
                    expandedRowKeys: expandedRowKeys,
                    onExpand: (expanded, record) => toggleExpand(record._id),
                }}

            />
        </>

    )
}

export default OrderCustomer;
