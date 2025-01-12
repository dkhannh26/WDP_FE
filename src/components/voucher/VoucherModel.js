import { Button, Col, Form, InputNumber, Row, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { layout, tailLayout } from '../../config/style.config';
import { createVoucher, editVoucher, getVoucher } from '../../services/voucher.service';

const VoucherModel = ({ type }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const { id } = useParams();

    const onFinish = (values) => {
        const voucher = {
            condition: values.condition,
            percent: values.percent,
        }

        if (type === 'create') {
            createVoucher(voucher, navigate)
        } else {
            editVoucher(id, voucher, navigate)
        }
    };

    useEffect(() => {
        if (type === 'edit') {
            getVoucher(id, form)
        }
    }, [id, type, form])
    return (
        <>
            <Row>
                <Title level={3}>
                    {type === 'create' ? 'New Voucher' : 'Edit Voucher'}
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
                        <Form.Item
                            name="percent"
                            label="VND"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    min: 0,
                                },
                            ]}

                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="condition"
                            label="Condition"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                },
                            ]}
                        >
                            <InputNumber suffix="$" style={{ width: '100%' }} />
                        </Form.Item>
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

export default VoucherModel;