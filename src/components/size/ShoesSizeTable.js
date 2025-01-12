import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Space, Table, message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_PATH } from "../../config/api.config";
import { MESSAGE } from '../../config/message.config';
import { SIZE_URL } from '../../config/url.config';
import { getListShoesSize } from '../../services/size.service';
import { showDeleteConfirm, success } from '../../utils/helper';

const SizeTable = () => {
    const [size, setSize] = useState([])
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage()
    const location = useLocation();
    const { state } = location;

    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => index + 1,
            width: '10%',
        },
        {
            title: 'Size',
            dataIndex: 'size_name',
            width: '15%',
        },
        {
            title: 'Action',
            dataIndex: '_id',
            render: (_id) => {
                return (
                    <Space>
                        {/* <Button shape="round" icon={<EditOutlined />} onClick={() => navigate(`edit/${_id}`)} ></Button> */}
                        <Button danger shape="round" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(_id, messageApi, getListShoesSize, setSize, API_PATH.shoesSize)} ></Button>
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

        getListShoesSize(setSize)
    }, [state, navigate, messageApi, location.pathname])

    return (
        <>
            <Flex gap="middle" align="center" justify='space-between'>
                {contextHolder}
                <Col>
                    <Title level={2}>Size Management</Title>
                </Col>
                <Col className="gutter-row" style={{ display: 'flex', justifyContent: 'flex-end  !important', alignItems: 'center !important', height: '100%' }}>
                    <Button onClick={() => navigate(SIZE_URL.SHOES_CREATE)}>Insert</Button>
                </Col>
            </Flex>
            <Table columns={columns} dataSource={size} />
        </>
    )
}

export default SizeTable;