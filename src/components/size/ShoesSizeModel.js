import { Button, Col, Form, InputNumber, Row, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { layout, tailLayout } from '../../config/style.config';
import { createShoesSize, editShoesSize, getShoesSize } from '../../services/size.service';

const SizeModel = ({ type }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const { id } = useParams();

    const onFinish = (values) => {
        const size = {
            size_name: values.size,
            quantity: values.quantity
        }

        if (type === 'create') {
            createShoesSize(size, navigate)
        } else {
            editShoesSize(id, size, navigate)
        }
    };

    useEffect(() => {
        if (type === 'edit')
            getShoesSize(id, dayjs, form)
    }, [id, type, form])

    return (
        <>
            <Row>
                <Title level={3}>
                    {type === 'create' ? 'New Size' : 'Edit Size'}
                </Title>
            </Row>
            <Row >
                <Col offset={4} span={12}>
                    <Form
                        {...layout}
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{
                            maxWidth: 600,
                        }}
                    >
                        {type === 'create' && (
                            <Form.Item
                                name="size"
                                label="Size Name"
                                rules={[
                                    {
                                        required: true,
                                        type: 'number',
                                        min: 36,
                                        max: 45
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        )}
                        {/* <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    min: 0
                                },
                            ]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item> */}
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit" >
                                    {type === 'create' ? 'Insert' : 'Edit'}
                                </Button>
                                <Button htmlType="button" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default SizeModel;