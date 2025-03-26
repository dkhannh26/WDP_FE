import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Space, Table, message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_PATH } from '../../config/api.config';
import { MESSAGE } from '../../config/message.config';
import { BRAND_URL } from '../../config/url.config';
import { getListBrand, getListFilter } from '../../services/brand.service';
import { showDeleteConfirm, success } from '../../utils/helper';
import Search from 'antd/es/input/Search';
import { useTranslation } from 'react-i18next';

const BrandTable = () => {
    const [brands, setBrands] = useState([])
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage()
    const [filteredBrands, setFilteredBrands] = useState(brands);
    const location = useLocation();
    const { state } = location;
    const onChange = (e) => {
        const value = e.target.value.toLowerCase();

        const filtered = brands.filter(
            (brands) =>
                brands.name.toLowerCase().includes(value)

        );
        setFilteredBrands(filtered);
    };
    const { t } = useTranslation();

    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => index + 1,
            width: '10%',
        },
        {
            title: t('table.created_date'),
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
            title: t('table.name'),
            dataIndex: 'name',
            // sorter: (a, b) => a.name - b.name,
            width: '15%',
        },
        {
            title: t('table.action'),
            dataIndex: '_id',
            render: (_id) => {
                return (
                    <Space>
                        <Button shape="round" icon={<EditOutlined />} onClick={() => navigate(`edit/${_id}`)} ></Button>
                        <Button danger shape="round" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(_id, messageApi, getListBrand, setBrands, API_PATH.brand)} ></Button>
                    </Space>
                )
            },
            width: '5%',
        },
    ];
    useEffect(() => {
        getListFilter(setBrands, setFilteredBrands)
    }, []);
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

        getListBrand(setBrands)
    }, [state, navigate, messageApi, location.pathname])

    return (
        <>
            <Flex gap="middle" align="center" justify='space-between'>
                {contextHolder}
                <Col>
                    <Title level={2}>{t('dashboard.brand_mng')}</Title>
                </Col>
                <Col className="gutter-row" style={{ display: 'flex', justifyContent: 'flex-end  !important', alignItems: 'center !important', height: '100%' }}>
                    <Button onClick={() => navigate(BRAND_URL.CREATE)}>{t('button.insert')}</Button>
                </Col>
            </Flex>
            <Row style={{ marginLeft: 0 }}>
                <Col span={6}>
                    <Search
                        placeholder={t('search.text')}
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
            <Table columns={columns} dataSource={filteredBrands} />
        </>
    )
}

export default BrandTable;