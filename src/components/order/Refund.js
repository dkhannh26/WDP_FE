import { CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Image, Input, Modal, Row, Space, Table, message } from 'antd';
import Search from 'antd/es/transfer/search';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH } from "../../config/api.config";
import { MESSAGE } from '../../config/message.config';
import { confirmRefund, getListRefund, getOrderDetails, refundReject, updateOrder } from '../../services/order.service';
import { success } from '../../utils/helper';
import { useAuth } from '../context/AuthContext';

const OrderTable = () => {
    const [orders, setOrders] = useState([])
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage()
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const location = useLocation();
    const { state } = location;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [reason, setReason] = useState('');
    const onChange = (e) => {
        const value = e.target.value.toLowerCase();

        const filtered = orders.filter(
            (orders) =>
                orders.account_id?.username.toLowerCase().includes(value) ||
                orders.phone.toLowerCase().includes(value) ||
                orders.address.toLowerCase().includes(value) ||
                orders.status.toLowerCase().includes(value)

        );
        setFilteredOrders(filtered);
    };


    const showModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (!reason) {
            messageApi.error('Vui lòng nhập lý do từ chối!!!');
            return;
        }

        const finalReason = 'Lý do từ chối: ' + reason;
        const order = {
            reject_reason: finalReason,
        };
        if (selectedOrderId) {
            updateOrder(selectedOrderId, order);
            refundReject(
                selectedOrderId,
                messageApi,
                () => getListRefund(initialValues.userId, (data) => {
                    setOrders(data);
                    setFilteredOrders(data);
                }),
                setOrders,
                setFilteredOrders,
                finalReason
            );
        }

        setIsModalVisible(false);
        setReason('');
        setSelectedOrderId(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setReason('');
        setSelectedOrderId(null);
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
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit'
            }),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Account',
            // dataIndex: 'account_id',
            width: '10%',
            render: (text, record) => {
                return record.account_id?.username
            }
        },
        {
            title: 'Confirm User',
            width: '10%',
            render: (text, record) => {
                return record.confirm_user_id?.username
            }
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: '10%',
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
        {
            title: 'Refund Reason',
            dataIndex: 'refund_reason',
            width: '20%',
        },
        {
            title: 'Cancel Reason',
            dataIndex: 'cancel_reason',
            width: '20%',
        },
        {
            title: 'Bank',
            dataIndex: 'bank',
            width: '5%',
        },
        {
            title: 'Action',
            dataIndex: '_id',
            render: (_id, record) => {
                return (
                    <Space>

                        {record.status === 'Pending Approval' && (
                            <>
                                {record.status === 'Pending Approval' && record.refund_reason !== '' && (

                                    <Button shape="round" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => showModal(_id)}>
                                    </Button>
                                )}  <Button
                                    shape="round"
                                    icon={<CheckOutlined style={{ color: 'green' }} />}
                                    onClick={() => {
                                        getOrderDetails(_id, setOrderDetails)
                                            .then(orderDetails => {
                                                confirmRefund(_id, messageApi, getListRefund, setOrders, setFilteredOrders, orderDetails, initialValues.userId);
                                            });
                                    }}
                                ></Button>
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
        if (!details || details.length === 0) return null;
        return (
            <div>
                {details.map((detail) => (
                    <div key={detail._id} style={{ borderBottom: '1px solid #888' }}>
                        <p><b>Name:</b> {detail?.product_name}</p>
                        <p><b>Price:</b> <del>{detail?.price.toLocaleString()}đ</del> <span style={{ color: 'red' }}>{((detail.price - (detail.price * (detail.discount / 100))) * detail.cartQuantity).toLocaleString()}đ</span></p>
                        <p><b>Quantity:</b> {detail.cartQuantity}</p>
                        <p><b>Images of RETURN/REFUND order:</b></p>
                        {detail.order_images.map((img) => (
                            <Image
                                width={100}
                                height={100}
                                src={`http://localhost:3000/images/order/${detail.order_id}/${img}`}
                                alt='hinh refund'
                            />
                        ))}
                    </div>
                ))}
            </div>
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
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [isAuthenticated]);


    useEffect(() => {
        getListRefund(setOrders, setFilteredOrders)
    }, [reason]);

    useEffect(() => {
        if (state?.message === MESSAGE.CREATE_SUCCESS) {
            success(state.message, messageApi);
            navigate(location.pathname, { replace: true }); //xóa state sau khi sử dụng
        } else if (state?.message === MESSAGE.UPDATE_SUCCESS) {
            success(state.message, messageApi);
            navigate(location.pathname, { replace: true });
        }

    }, [state, navigate, messageApi, location.pathname])

    return (
        <>
            <Flex gap="middle" align="center" justify='space-between'>
                {contextHolder}
                <Col>
                    <Title level={2}>Return/Refund Management</Title>
                </Col>
            </Flex>
            <Row style={{ marginLeft: 0 }}>
                <Col span={6}>
                    <Search
                        placeholder="Enter info order to search"
                        allowClear
                        enterButton
                        size="large"
                        onChange={onChange}
                        style={{
                            width: 350,
                            display: "flex",
                            justifyContent: "flex-start",
                            marginBottom: "10px",
                        }}
                    />
                </Col>
            </Row>
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
            <Modal
                title="Lý do trả hàng"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Title level={4}>Vui lòng nhập lý do từ chối</Title>
                <Input
                    placeholder="Nhập lý do cụ thể"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{ marginTop: 10 }}
                />
            </Modal>
        </>
    )
}

export default OrderTable;
