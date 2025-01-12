import { Button, Col, Form, List, Modal, Row, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import '../../assets/css/feedback.css';
import { createFeedback, getFeedBack, getListFeedback, updateFeedback } from '../../services/feedback.service';
import { API_PATH } from '../../config/api.config';
import { showDeleteConfirm } from '../../utils/helper';

const CustomerFeedback = ({ accessory_id, pant_id, tshirt_id, shoes_id, userId }) => {
    const [feedback, setFeedback] = useState([]);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage()
    const [currentFeedback, setCurrentFeedback] = useState(false);
    const [id, setId] = useState('');

    const selectId = accessory_id || pant_id || tshirt_id || shoes_id
    const onFinish = (values) => {
        console.log('Success:', values.content);
        console.log(userId);
        const feedbackData = {
            content: values.content,
            account_id: userId,
            accessory_id: accessory_id,
            pant_id: pant_id,
            tshirt_id: tshirt_id,
            shoes_id: shoes_id
        }
        if (currentFeedback) {
            updateFeedback(id, feedbackData)
        } else {
            createFeedback(feedbackData)
        }
        setIsModalOpen(false)
    };
    const editFeedback = (feedbackItem, id) => {
        setCurrentFeedback(true);
        setId(id)
        console.log(id);
        form.setFieldsValue({ content: feedbackItem.content });
        setIsModalOpen(true);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    // const handleOk = () => {
    //     setIsModalOpen(false);
    // };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        getListFeedback(selectId, setFeedback)
    }, [feedback, isModalOpen, selectId])


    return (
        <div style={{ width: 900, margin: 'auto', marginTop: 100 }}>
            <Row style={{ justifyContent: 'space-between', paddingBottom: 40, }}>
                <p style={{ fontSize: 25, fontWeight: 'bold' }}>Feedback</p>
                <Button style={{ backgroundColor: "black", borderRadius: 0 }} type="primary" onClick={showModal}>
                    Write Feedback
                </Button>
            </Row>
            <Modal title="Write new feedback" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    className='customer-feedback'
                    name="basic"
                    form={form}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='content'
                        rules={[
                            {
                                min: 3,
                                max: 200,
                                message: 'Content length must be between 3 and 200 characters.',
                            },
                        ]}
                    >
                        <TextArea autoSize={{
                            minRows: 4,
                            maxRows: 5,
                        }} />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 20 }}>
                        <Button color="default" variant="solid" htmlType="submit" style={{ marginRight: 15 }}>
                            Send feedback
                        </Button>
                        <Button color="default" variant="outlined" onClick={() => form.resetFields()}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>


            <List
                style={{ padding: '30px 0', borderTop: '1px solid gray', borderBottom: '1px solid gray' }}
                itemLayout="horizontal"
                dataSource={feedback}
                split={false}
                renderItem={(item, index) => (
                    <List.Item style={{ marginBottom: 15, display: "block", }}>
                        <Row>
                            <Col span={6}>
                                <b>{item.account_id.username}</b>
                                <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                            </Col>
                            <Col span={18}>
                                {item.content}
                                <Row style={{ marginTop: 10 }}>
                                    {userId === item.account_id._id && (
                                        <>
                                            <Button style={{ backgroundColor: '#FF9800', color: 'white', marginRight: 10 }} onClick={() => editFeedback(item, item._id)}>Edit</Button>
                                            <Button style={{ backgroundColor: '#FF5252  ', color: 'white' }} onClick={() => showDeleteConfirm(item._id, messageApi, () => getListFeedback(selectId, setFeedback), setFeedback, API_PATH.feedback)}>Remove</Button>
                                        </>
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default CustomerFeedback;