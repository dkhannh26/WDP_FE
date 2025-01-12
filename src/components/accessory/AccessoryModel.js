import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { layout, tailLayout } from '../../config/style.config';
import { createAccessory, editAccessory, getAccessory } from '../../services/product/accessory.service';
import { getListDiscount } from '../../services/discount.service';
import UploadImg from '../UploadImg';

const { Option } = Select;
const AccessoryModel = ({ type }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const { id } = useParams();
    const [discounts, setDiscounts] = useState()
    const [fileList, setFileList] = useState([]);
    const currentDate = new Date();
    const handleFileListChange = (newFileList) => {
        setFileList(newFileList);
    };

    const onFinish = async (values) => {
        const accessory = {
            name: values.name,
            price: values.price,
            quantity: values.quantity,
            discount_id: values.discount,
        }

        if (type === 'create') {
            createAccessory(accessory, fileList, navigate)
        } else {
            editAccessory(id, accessory, fileList, navigate)
        }
    };


    useEffect(() => {
        getListDiscount(setDiscounts)
        if (type === 'edit') getAccessory(id, form, handleFileListChange)
    }, [id, type, form])


    return (
        <>
            <Row>
                <Title level={3}>
                    {type === 'create' ? 'New Accessory' : 'Edit Accessory'}
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
                            name="quantity"
                            label="Quantity"
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


export default AccessoryModel;