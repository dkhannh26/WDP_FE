import { CheckOutlined, CloseOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Space, Table, message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_PATH } from "../../config/api.config";
import { MESSAGE } from '../../config/message.config';
import { cancelOrder, confirmOrder, getListOrder, getOrderDetails } from '../../services/order.service';
import { showDeleteConfirm, success } from '../../utils/helper';
import Search from 'antd/es/transfer/search';
import { checkPermission } from '../../utils/permission';
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
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: t('table.account'),
            // dataIndex: 'account_id',
            width: '15%',
            render: (text, record) => {
                return record.account_id?.username
            }
        },
        {
            title: t('table.phone'),
            dataIndex: 'phone',
            width: '20%',
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
        },
        {
            title: t('table.action'),
            dataIndex: '_id',
            render: (_id, record) => {
                return (
                    <Space>
                        {record.status === 'pending' && (
                            <>
                                {
                                    checkPermission('cancelOrder') ?
                                        <Button shape="round" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => cancelOrder(_id, messageApi, getListOrder, setOrders, setFilteredOrders, orderDetails)}></Button>
                                        : ''
                                }
                                {
                                    checkPermission('confirmOrder') ?
                                        <Button
                                            shape="round"
                                            icon={<CheckOutlined style={{ color: 'green' }} />}
                                            onClick={() => {
                                                getOrderDetails(_id, setOrderDetails)
                                                    .then(orderDetails => {
                                                        confirmOrder(_id, messageApi, getListOrder, setOrders, setFilteredOrders, orderDetails);
                                                    });
                                            }}
                                        ></Button>
                                        : ''
                                }

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


    useEffect(() => {
        getListOrder(setOrders, setFilteredOrders)
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
        </>
    )
}

export default OrderTable;
