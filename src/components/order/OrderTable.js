import { CheckOutlined, CloseOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Input, Modal, Radio, Row, Select, Space, Table, message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_PATH, PATH } from "../../config/api.config";
import { MESSAGE } from '../../config/message.config';
import { cancelOrder, confirmOrder, getListOrder, getOrderDetails, updateOrder } from '../../services/order.service';
import { showDeleteConfirm, success } from '../../utils/helper';
import Search from 'antd/es/transfer/search';
import { checkPermission } from '../../utils/permission';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useTranslation } from "react-i18next";

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
    const [fileList, setFileList] = useState([]);
    const [cancelReason, setCancelReason] = useState('');
    const [otherCancelReason, setOtherCancelReason] = useState('');

    const { t, i18n } = useTranslation();

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

    const handleFilterChange = (value) => {
        let filtered = [];
        if (value === "All") {
            filtered = orders;
        } else {
            filtered = orders.filter((order) => order.status === value);
        }
        setFilteredOrders(filtered);
    };


    const cancelReasons = [
        { label: 'Đơn hàng bị lỗi', value: 'Đơn hàng bị lỗi' },
        { label: 'Đơn hàng không đủ điều kiện giao', value: 'Đơn hàng không đủ điều kiện giao' },
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
        if (!cancelReason) {
            messageApi.error('Vui lòng chọn lý do huỷ hàng!');
            return;
        }
        if (diffInDays > 7) {
            messageApi.error('Đơn hàng chỉ có thể hủy trong vòng 7 ngày kể từ khi tạo!');
            setIsModalVisible(false);
            return;
        }


        const finalCancelReason = cancelReason === 'other' ? otherCancelReason : cancelReason;
        const order = {
            cancel_reason: finalCancelReason
        };
        if (selectedOrderId && order.cancel_reason) {
            updateOrder(selectedOrderId, order, fileList);
            cancelOrder
                (selectedOrderId, messageApi, getListOrder, setOrders, setFilteredOrders, orderDetails, initialValues.userId)
                ;
        }

        setIsModalVisible(false);
        setCancelReason('');
        setSelectedOrderId(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCancelReason('');
        setSelectedOrderId(null);
    };
    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => index + 1,
            width: '5%',
        },
        {
            title: t('table.day'),
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
            title: t('table.account'),
            // dataIndex: 'account_id',
            width: '10%',
            render: (text, record) => {
                return record.account_id?.username
            }
        },
        {
            title: 'Confirm Staff',
            width: '10%',
            render: (text, record) => {
                return record.confirm_user_id?.username
            }
        },
        {
            title: t('table.phone'),
            dataIndex: 'phone',
            width: '10%',
        },
        {
            title: t('table.address'),
            dataIndex: 'address',
            width: '20%',
        },
        {
            title: t('table.total'),
            dataIndex: 'total_price',
            sorter: (a, b) => a.total_price - b.total_price,
            width: '10%',
        },
        {
            title: t('table.status'),
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
            title: 'Cancel Reason',
            dataIndex: 'cancel_reason',
            width: '20%',
        },
        {
            title: t('table.action'),
            dataIndex: '_id',
            render: (_id, record) => {
                return (
                    <Space>

                        {record.status === 'Pending' && (
                            <>
                                <Button shape="round" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => showModal(_id)}></Button>
                                <Button
                                    shape="round"
                                    icon={<CheckOutlined style={{ color: 'green' }} />}
                                    onClick={() => {
                                        getOrderDetails(_id, setOrderDetails)
                                            .then(orderDetails => {
                                                confirmOrder(_id, messageApi, getListOrder, setOrders, setFilteredOrders, orderDetails, initialValues.userId);
                                            })
                                            .catch((err) => {
                                                messageApi.error(err.message);
                                            });
                                    }}
                                ></Button>
                            </>
                        )}
                        {
                            checkPermission('deleteOrder') ?
                                <Button danger shape="round" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(_id, messageApi, getListOrder, setOrders, API_PATH.order, setFilteredOrders)}></Button>
                                :
                                ''
                        }
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
                        <p><b>Size:</b> {detail.product_size_name}</p>
                    </div>
                ))}
            </div>
        );
    };

    // useEffect(() => {
    //     getListOrder((data) => {
    //         setOrders(data);
    //         setFilteredOrders(data);
    //     });
    // }, []);
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
                    });
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [isAuthenticated]);

    useEffect(() => {
        getListOrder((data) => {
            setOrders(data);
            setFilteredOrders(data);
        })
    }, []);

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
                    <Title level={2}>Order Management</Title>
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
                <Col span={6}>
                    <div style={{ fontWeight: 600, fontSize: 20 }}>
                        <FilterOutlined /> Filter
                        <Select
                            defaultValue="All"
                            style={{
                                marginLeft: 20,
                                width: 150,
                            }}
                            onChange={handleFilterChange}
                        >
                            <Select.Option value="All">All</Select.Option>
                            <Select.Option value="Pending">Pending</Select.Option>
                            <Select.Option value="In Transit">In Transit</Select.Option>
                            <Select.Option value="Completed">Completed</Select.Option>
                            <Select.Option value="Cancelled">Cancelled</Select.Option>
                            <Select.Option value="Paid">Paid</Select.Option>
                            <Select.Option value="Pending Approval">Pending Approval</Select.Option>
                            <Select.Option value="Return Approved">Return Approved</Select.Option>
                            <Select.Option value="Reject">Reject</Select.Option>
                        </Select>
                    </div>
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
        </>
    )
}

export default OrderTable;
