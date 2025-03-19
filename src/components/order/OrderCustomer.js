import { CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeOutlined, TruckOutlined, RedoOutlined } from "@ant-design/icons";
import { Button, Image, Input, List, Menu, Modal, Radio, Row, Space, Table, Typography, message } from "antd";
import Search from "antd/es/input/Search";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_PATH, PATH } from "../../config/api.config";
import { cancelOrder, getAllOrder, getListCancelOrder, getListDoneOrder, getListOrderDetail, getListPendingOrder, getListRefundOrder, getListTransOrder, getOrderDetails, refundOrder, shippedOrder, updateOrder } from "../../services/order.service";
import UploadImg from '../common/UploadImg';
import { useAuth } from "../context/AuthContext";
import { success } from '../../utils/helper';
import { MESSAGE } from "../../config/message.config";
const { Text, Title } = Typography;

const OrderCustomer = () => {
    const [status, setStatus] = useState("All");
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [allOrderDetails, setAllOrderDetails] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [messageApi, contextHolder] = message.useMessage()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [refundReason, setRefundReason] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [bank, setBank] = useState('');
    const [otherRefundReason, setOtherRefundReason] = useState('');
    const [otherCancelReason, setOtherCancelReason] = useState('');
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const handleFileListChange = (newFileList) => {
        setFileList(newFileList);
    };

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
        setFilteredOrders(filtered);
    };
    const returnReasons = [
        { label: 'Hàng bị lỗi', value: 'Hàng bị lỗi' },
        { label: 'Không thích sản phẩm', value: 'Không thích sản phẩm' },
        { label: 'Đổi ý', value: 'Đổi ý' },
        { label: 'Khác', value: 'other' },
    ];
    const cancelReasons = [
        { label: 'Không thích sản phẩm', value: 'Không thích sản phẩm' },
        { label: 'Đổi ý', value: 'Đổi ý' },
        { label: 'Khác', value: 'other' },
    ];

    const showModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        const selectedOrder = orders.find(order => order._id === selectedOrderId);
        const createdAt = new Date(selectedOrder?.createdAt);
        const currentDate = new Date();
        const diffInDays = (currentDate - createdAt) / (1000 * 60 * 60 * 24)
        if (status === 'Completed') {
            if (!refundReason) {
                messageApi.error('Vui lòng chọn lý do trả hàng!');
                return;
            }
            if (!bank) {
                messageApi.error('Vui lòng nhập số tài khoản và ngân hàng');
                return;
            }
            if (diffInDays > 7) {
                messageApi.error('Đơn hàng chỉ có thể hủy trong vòng 7 ngày kể từ khi tạo!');
                setIsModalVisible(false);
                return;
            }
        } else if (status === 'Paid') {
            if (!cancelReason) {
                messageApi.error('Vui lòng chọn lý do huỷ hàng!');
                return;
            }
            if (!bank) {
                messageApi.error('Vui lòng nhập số tài khoản và ngân hàng');
                return;
            }
            if (diffInDays > 7) {
                messageApi.error('Đơn hàng chỉ có thể hủy trong vòng 7 ngày kể từ khi tạo!');
                setIsModalVisible(false);
                return;
            }
        } else if (status === 'Pending') {
            if (!cancelReason) {
                messageApi.error('Vui lòng chọn lý do huỷ hàng!');
                return;
            }
            if (diffInDays > 7) {
                messageApi.error('Đơn hàng chỉ có thể hủy trong vòng 7 ngày kể từ khi tạo!');
                setIsModalVisible(false);
                return;
            }
        }


        const finalRefundReason = refundReason === 'other' ? otherRefundReason : refundReason;
        const finalCancelReason = cancelReason === 'other' ? otherCancelReason : cancelReason;
        const order = {
            refund_reason: finalRefundReason,
            bank: bank,
            cancel_reason: finalCancelReason
        };
        if (selectedOrderId && order.bank) {
            updateOrder(selectedOrderId, order, fileList);
            refundOrder(
                selectedOrderId,
                messageApi,
                () => getListPendingOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                }),
                setOrders,
                setFilteredOrders,
            );
        } else if (selectedOrderId && order.cancel_reason) {
            updateOrder(selectedOrderId, order, fileList);
            cancelOrder(
                selectedOrderId,
                messageApi,
                () => getListPendingOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                }),
                setOrders,
                setFilteredOrders,
            );
        }

        setIsModalVisible(false);
        setRefundReason('');
        setCancelReason('');
        setBank('');
        setSelectedOrderId(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setRefundReason('');
        setCancelReason('');
        setBank('');
        setSelectedOrderId(null);
    };
    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => index + 1,
            width: '2%',
        },
        {
            title: 'Day',
            dataIndex: 'createdAt',
            width: '10%',
            render: (text) => new Date(text).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit'
            }),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: '10%',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            width: '30%',
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
            render: (status) => {
                let color;
                switch (status) {
                    case 'Pending':
                        color = '#faad14';
                        break;
                    case 'Pending Approval':
                        color = 'orange';
                        break;
                    case 'Paid':
                        color = '#52c41a';
                        break;
                    case 'In Transit':
                        color = '#1890ff';
                        break;
                    case 'Completed':
                        color = '#52c41a';
                        break;
                    case 'Return Approved':
                        color = '#52c41a';
                        break;
                    case 'Cancelled':
                        color = '#f5222d';
                        break;
                    case 'Return Refund':
                        color = '#faad14';
                        break;
                    case 'Reject':
                        color = '#f5222d';
                        break;
                    default:
                        color = '#000000';
                }
                return <span style={{ color }}>{status}</span>;
            },
        },
        ...(status === 'Return Refund' ? [{
            title: 'Reject Reason',
            dataIndex: 'reject_reason',
            width: '20%',
        }] : []),
        ...(status === 'Cancelled' ? [{
            title: 'Cancel Reason',
            dataIndex: 'cancel_reason',
            width: '20%',
        }] : []),
        {
            title: 'Action',
            dataIndex: '_id',
            render: (_id, record) => {
                return (
                    <>
                        {status !== 'All' && (
                            <Space>
                                {record.status === 'Completed' && (

                                    <Button shape="round" icon={<RedoOutlined style={{ color: 'red' }} />} onClick={() => showModal(_id)}>
                                    </Button>
                                )}
                                {record.status === 'Pending' && (
                                    <Button shape="round" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => showModal(_id)}></Button>
                                )}
                                {record.status === 'Paid' && (
                                    <Button shape="round" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => { setStatus('Paid'); showModal(_id); }}></Button>
                                )}

                                {record.status === 'In Transit' && (
                                    <Button shape="round" icon={<CheckOutlined style={{ color: 'green' }} />} onClick={() => shippedOrder(_id, messageApi,
                                        () => getListTransOrder(initialValues.userId, (data) => {
                                            setOrders(data);
                                            setFilteredOrders(data);
                                        }),
                                        setOrders, setFilteredOrders)}></Button>
                                )}
                            </Space >
                        )}
                    </>
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
                                {/* {status === "pending" ? "Pending" : "Successful delivery"} */}
                                Detail Order Infomation
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
            if (status === "All") {
                getAllOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                });
            } else if (status === "Pending") {
                getListPendingOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                });
            }
            else if (status === "In Transit") {
                getListTransOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                });
            } else if (status === "Completed") {
                getListDoneOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                });
            } else if (status === "Cancelled") {
                getListCancelOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                });
            } else if (status === "Return Refund") {
                getListRefundOrder(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                });
            }
        };
        fetchOrders();
    }, [status, initialValues.userId]);
    useEffect(() => {
        if (state?.message === MESSAGE.CREATE_SUCCESS) {
            success(state.message, messageApi);
            navigate(location.pathname, { replace: true }); //xóa state sau khi sử dụng
        } else if (state?.message === MESSAGE.UPDATE_SUCCESS) {
            success(state.message, messageApi);
            navigate(location.pathname, { replace: true });
        }

    }, [state, navigate, messageApi, location.pathname])
    const items = [
        {
            label: "All",
            key: "ALL",
            onClick: () => setStatus("All"),
        },
        {
            label: "To Pay",
            key: "TO_PAY",
            onClick: () => setStatus("Pending"),
        },
        {
            label: "To Ship",
            key: "TO_SHIP",
            onClick: () => setStatus("In Transit"),
        },
        {
            label: "Completed",
            key: "COMPLETED",
            onClick: () => setStatus("Completed"),
        },
        {
            label: "Cancelled",
            key: "CANCELLED",
            onClick: () => setStatus("Cancelled"),
        },
        {
            label: "Return Refund",
            key: "RETURN_REFUND",
            onClick: () => setStatus("Return Refund"),
        },
    ];

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            {contextHolder}
            <div style={{ justifyContent: 'center', display: 'flex', margin: '1%' }}>
                <Row className="container header-menu">
                    <Menu
                        mode="horizontal"
                        items={items}
                        style={{ gap: '3%', fontSize: '16px', justifyContent: 'center', width: '100%' }}
                    />
                </Row>
            </div>

            <Search
                placeholder="Enter name of product to search"
                allowClear
                enterButton
                size="large"
                onChange={onChange}
                style={{
                    width: 350,
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "10px",
                    marginLeft: "19%"
                }}
            />

            <div style={{ justifyContent: 'center', display: 'flex', margin: '1%' }}>
                <Row className="container">
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
                        style={{ width: '100%' }}
                    />
                </Row>
                {status === 'Completed' && (
                    <Modal
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Title level={3}>Lý do trả hàng:</Title>
                        <Title level={4}>Vui lòng chọn lý do trả hàng:</Title>
                        <Radio.Group onChange={(e) => setRefundReason(e.target.value)} value={refundReason}>
                            <Space direction="vertical">
                                {returnReasons.map((item) => (
                                    <Radio key={item.value} value={item.value}>
                                        {item.label}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                        {refundReason === 'other' && (
                            <Input
                                placeholder="Nhập lý do cụ thể"
                                value={otherRefundReason}
                                onChange={(e) => setOtherRefundReason(e.target.value)}
                                style={{ marginTop: 10 }}
                            />
                        )}
                        <Title level={4} style={{ marginTop: 10 }}>Vui lòng nhập đúng số tài khoản và ngân hàng:</Title>
                        <Input
                            placeholder="Nhập đúng số tài khoản và ngân hàng"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            style={{ marginTop: 10, marginBottom: 10 }}
                        />
                        <Title level={4} style={{ marginTop: 10 }}>Thêm hình ảnh về sản phẩm:</Title>
                        <UploadImg onFileListChange={handleFileListChange} filesApi={fileList}></UploadImg>
                    </Modal>
                )}
                {status === 'Paid' && (
                    <Modal
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Title level={3}>Lý do huỷ hàng:</Title>
                        <Title level={4}>Vui lòng chọn lý do huỷ hàng:</Title>
                        <Radio.Group onChange={(e) => setCancelReason(e.target.value)} value={cancelReason}>
                            <Space direction="vertical">
                                {cancelReasons.map((item) => (
                                    <Radio key={item.value} value={item.value}>
                                        {item.label}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                        {cancelReason === 'other' && (
                            <Input
                                placeholder="Nhập lý do cụ thể"
                                value={otherCancelReason}
                                onChange={(e) => setOtherCancelReason(e.target.value)}
                                style={{ marginTop: 10 }}
                            />
                        )}
                        <Title level={4} style={{ marginTop: 10 }}>Vui lòng nhập đúng số tài khoản và ngân hàng:</Title>
                        <Input
                            placeholder="Nhập đúng số tài khoản và ngân hàng"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            style={{ marginTop: 10, marginBottom: 10 }}
                        />
                    </Modal>
                )}
                {status === 'Pending' && (
                    <Modal
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Title level={3}>Lý do huỷ hàng:</Title>
                        <Title level={4}>Vui lòng chọn lý do huỷ hàng:</Title>
                        <Radio.Group onChange={(e) => setCancelReason(e.target.value)} value={cancelReason}>
                            <Space direction="vertical">
                                {cancelReasons.map((item) => (
                                    <Radio key={item.value} value={item.value}>
                                        {item.label}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                        {cancelReason === 'other' && (
                            <Input
                                placeholder="Nhập lý do cụ thể"
                                value={otherCancelReason}
                                onChange={(e) => setOtherCancelReason(e.target.value)}
                                style={{ marginTop: 10 }}
                            />
                        )}
                    </Modal>
                )}
            </div>
        </>
    )
}

export default OrderCustomer;
