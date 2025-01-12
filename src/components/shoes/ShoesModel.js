import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { layout, tailLayout } from '../../config/style.config';
import { createShoes, editShoes, getShoes } from '../../services/product/shoes.service';
import { getListDiscount } from '../../services/discount.service';
import UploadImg from '../UploadImg';

const { Option } = Select;
const ShoesModel = ({ type }) => {
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
        const shoes = {
            name: values.name,
            price: values.price,
            size: {
                38: values.size38,
                39: values.size39,
                40: values.size40,
                41: values.size41,
                42: values.size42,
                43: values.size43,
            },
            discount_id: values.discount,
        }

        console.log(shoes)

        if (type === 'create') {
            createShoes(shoes, fileList, navigate)
        } else {
            editShoes(id, shoes, fileList, navigate)
        }
    };


    useEffect(() => {
        getListDiscount(setDiscounts)
        if (type === 'edit') getShoes(id, form, handleFileListChange)

    }, [id, type, form])


    return (
        <>
            <Row>
                <Title level={3}>
                    {type === 'create' ? 'New Shoes' : 'Edit Shoes'}
                </Title>
            </Row>
            <Row >
                <Col offset={4} span={12}>
                    <Form
                        {...layout}
                        form={form}
                        layout="horizontal"
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
                        <Row >
                            <Col offset={3} span={9}>
                                <Form.Item
                                    style={{ width: '440px' }}
                                    name="size38"
                                    label="Quantity of size 38"
                                    rules={[
                                        {
                                            type: 'number',
                                            min: 0
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '17%', float: 'left' }} />
                                </Form.Item>
                                <Form.Item
                                    style={{ width: '440px' }}
                                    name="size39"
                                    label="Quantity of size 39"
                                    rules={[
                                        {
                                            type: 'number',
                                            min: 0
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '17%', float: 'left' }} />
                                </Form.Item>
                                <Form.Item
                                    style={{ width: '440px' }}
                                    name="size40"
                                    label="Quantity of size 40"
                                    rules={[
                                        {
                                            type: 'number',
                                            min: 0
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '17%', float: 'left' }} />
                                </Form.Item>
                            </Col>
                            <Col offset={2} span={10}>
                                <Form.Item
                                    style={{ width: '440px' }}
                                    name="size41"
                                    label="Quantity of size 41"
                                    rules={[
                                        {
                                            type: 'number',
                                            min: 0
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '17%', float: 'left' }} />
                                </Form.Item>
                                <Form.Item
                                    style={{ width: '440px' }}
                                    name="size42"
                                    label="Quantity of size 42"
                                    rules={[
                                        {
                                            type: 'number',
                                            min: 0
                                        },
                                    ]}
                                >

                                    <InputNumber style={{ width: '17%', float: 'left' }} />
                                </Form.Item>
                                <Form.Item
                                    style={{ width: '440px' }}
                                    name="size43"
                                    label="Quantity of size 43"
                                    rules={[
                                        {
                                            type: 'number',
                                            min: 0
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '17%', float: 'left' }} />
                                </Form.Item>
                            </Col>
                        </Row>


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


export default ShoesModel;