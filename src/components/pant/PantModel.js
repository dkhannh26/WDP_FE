import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { layout, tailLayout } from '../../config/style.config';
import { createPant, editPant, getPant } from '../../services/product/pant.service';
import { getListDiscount } from '../../services/discount.service';
import UploadImg from '../UploadImg';

const { Option } = Select;
const PantModel = ({ type }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const { id } = useParams();
    const [discounts, setDiscounts] = useState()
    const [fileList, setFileList] = useState([]);
    const [load, setLoad] = useState(false)
    const handleFileListChange = (newFileList) => {
        setFileList(newFileList);
    };
    const currentDate = new Date();

    const onFinish = async (values) => {
        const pant = {
            name: values.name,
            price: values.price,
            size: {
                S: values.S,
                M: values.M,
                L: values.L
            },
            discount_id: values?.discount,
        }

        if (type === 'create') {
            createPant(pant, fileList, navigate)
        } else {
            editPant(id, pant, fileList, navigate, setLoad)
        }
    };

    useEffect(() => {
        getListDiscount(setDiscounts)
        if (type === 'edit') getPant(id, form, handleFileListChange)
    }, [id, type, form])

    return (
        <>
            <Row>
                <Title level={3}>
                    {type === 'create' ? 'New Pant' : 'Edit Pant'}
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
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
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
                            name="discount"
                            label="Discount"

                        >
                            <Select
                                placeholder="Select a discount"
                                allowClear
                            >
                                {discounts?.map((discount) => {
                                    const date = new Date(discount?.expired_at)
                                    if (date > currentDate) return (
                                        <Option value={discount._id}>{discount.percent}%</Option>
                                    )
                                    return null
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="S"
                            label="Quantity of size S"
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
                            name="M"
                            label="Quantity of size M"
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
                            name="L"
                            label="Quantity of size L"
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
                            name="image"
                            label="Upload image"
                            valuePropName="fileList"
                        // getValueFromEvent={normFile}
                        // extra="longgggggggggggggggggggggggggggggggggg"
                        >
                            <UploadImg onFileListChange={handleFileListChange} filesApi={fileList}></UploadImg>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit" loading={load} >
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


export default PantModel;