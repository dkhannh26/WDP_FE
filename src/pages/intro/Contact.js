import React from 'react';
import { Input, Col, Row, Button, Form, List } from 'antd';
import { FaMapMarkerAlt } from "react-icons/fa";
import { MailOutlined, PhoneOutlined, FieldTimeOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Contact = () => {
    const onFinish = (values) => {
        console.log('Form Values:', values);
    };

    const data = [
        {
            icon: <FaMapMarkerAlt />,
            title: 'Address',
            description: '1, Nguyen Van Cu, Ninh Kieu District, Can Tho City'
        },
        {
            icon: <MailOutlined />,
            title: 'Email',
            description: 'dotai.info@gmail.com'
        },
        {
            icon: <PhoneOutlined />,
            title: 'Phone',
            description: '012.345.6789 - 099.999.9999'
        },
        {
            icon: <FieldTimeOutlined />,
            title: 'Working hours',
            description: 'All days of the week'
        },
    ];

    return (
        <div>
            <h1 style={{color:'rgb(51, 51, 51)', fontSize: '50px', textAlign: 'center', marginTop: '5%' }}>Contact</h1>
            <Row style={{ margin: '3% 7%' }} gutter={[32, 32]}>
                <Col span={24}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3473.371170028228!2d105.76487657438898!3d10.046233272238796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0880fad55bbad%3A0x4c11a5277c86eb40!2zMSDEkC4gTmd1eeG7hW4gVsSDbiBD4burLCBBbiBIb8OgLCBOaW5oIEtp4buBdSwgQ-G6p24gVGjGoSA5MDAwMCwgVmlldG5hbQ!5e1!3m2!1sen!2s!4v1729172993527!5m2!1sen!2s"
                        width="100%"
                        height="550"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </Col>
            </Row>
            <Row style={{ width: '85%', margin: "5% auto" }} gutter={[32, 32]}>
                <Col xs={24} lg={10}>
                    <h2>Contact information</h2>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<div style={{
                                        border: 'solid 1px gray', borderRadius: '50%', textAlign: 'center', padding: '5px 10px', marginTop: '5px'
                                    }}>{item.icon}</div>}
                                    title={item.title}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </Col>

                {/* Phần form liên hệ */}
                <Col xs={24} lg={14}>
                    <h2>Send us your inquiry</h2>
                    <p style={{ margin: '10px 0', fontSize: '14px', color: 'gray' }} >If you have any questions, you can send us a request, and we will contact you as soon as possible.</p>

                    <Form onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                                    <Input style={{ padding: '10px', borderRadius: '0' }} placeholder="Your name" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
                                    <Input style={{ padding: '10px', borderRadius: '0' }} placeholder="Your email" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="phone" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                                    <Input style={{ padding: '10px', borderRadius: '0' }} placeholder="Your phone number" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item name="content" rules={[{ required: true, message: 'Please enter your content' }]}>
                                    <TextArea style={{ padding: '10px', borderRadius: '0' }} rows={4} placeholder="Content" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <small>This site is protected by reCAPTCHA and the Google <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.</small>
                        </div>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: 'black', borderRadius: '0', padding: ' 25px 30px' }}>
                                SEND IT TO US
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Contact;
