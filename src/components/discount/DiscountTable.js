import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Flex, message, Space, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_PATH } from '../../config/api.config';
import { MESSAGE } from '../../config/message.config';
import { DISCOUNT_URL } from '../../config/url.config';
import { getListDiscount } from '../../services/discount.service';
import { formatDate, showDeleteConfirm, success } from '../../utils/helper';
import { useTranslation } from 'react-i18next';

const DiscountTable = () => {
    const [discounts, setDiscounts] = useState([])
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage()
    const location = useLocation();
    const { state } = location;
    const { t, i18n } = useTranslation();
    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => index + 1,
            width: '10%',
        },
        {
            title: (t('table.percent')),
            dataIndex: 'percent',
            sorter: (a, b) => a.percent - b.percent,
            width: '15%',
        },
        {
            title: (t('table.expiry')),
            dataIndex: 'expired_at',
            render: (date) => {
                return formatDate(date)
            },
            sorter: (a, b) => new Date(a.expired_at) - new Date(b.expired_at),

            width: '20%',
        },
        {
            title: (t('table.action')),
            dataIndex: '_id',
            render: (_id) => {
                return (
                    <Space>
                        <Button shape="round" icon={<EditOutlined />} onClick={() => navigate(`edit/${_id}`)} ></Button>
                        <Button danger shape="round" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(_id, messageApi, getListDiscount, setDiscounts, API_PATH.discount)} ></Button>
                    </Space>
                )
            },
            width: '5%',
        },
    ];

    useEffect(() => {
        if (state?.message === MESSAGE.CREATE_SUCCESS) {
            console.log('message', state?.message)
            success(state.message, messageApi);
            navigate(location.pathname, { replace: true }); //xóa state sau khi sử dụng
        } else if (state?.message === MESSAGE.UPDATE_SUCCESS) {
            console.log('message', state?.message)
            success(state.message, messageApi);
            navigate(location.pathname, { replace: true });
        }

        getListDiscount(setDiscounts)
    }, [state, navigate, messageApi, location.pathname])

    return (
        <>
            <Flex gap="middle" align="center" justify='space-between'>
                {contextHolder}
                <Col>
                    <Title level={2}>{t('dashboard.discount_mng')}</Title>
                </Col>
                <Col className="gutter-row" style={{ display: 'flex', justifyContent: 'flex-end  !important', alignItems: 'center !important', height: '100%' }}>
                    <Button onClick={() => navigate(DISCOUNT_URL.CREATE)}>{t('button.insert')}</Button>
                </Col>
            </Flex>
            <Table columns={columns} dataSource={discounts} />
        </>
    )
}

export default DiscountTable;