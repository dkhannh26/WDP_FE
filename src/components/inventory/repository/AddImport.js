import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Form, List, Row } from 'antd';
import React from 'react';

// const { Option } = Select;

const data = [
    {
        title: 'Vợt Yonex 100ZZ Kurenai',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];

const AddImport = () => {
    const containerStyle = {
        maxWidth: '500px',
        margin: '20px',
        padding: '20px',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
    };

    const titleStyle = {
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold',
    };

    const buttonStyle = {
        width: '100%',
    };

    const CustomerDescription = (sizes) =>
        <Row>
            <Col span={20} style={{ paddingLeft: 30 }}>
                <ul style={{ fontSize: 17 }}>
                    <li>Size 4U - Quantity 30</li>
                    <li>Size 4U - Quantity 30</li>
                </ul>
            </Col>
            <Col span={2}>
                <Button
                    danger
                    style={{
                        marginRight: 5,
                    }}
                    shape="round"
                    icon={<CloseOutlined />}
                ></Button>
            </Col>
        </Row>


    return (
        <div style={containerStyle}>
            <h3 style={titleStyle}>Add Import</h3>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            style={{
                                textAlign: 'left',
                            }}
                            title={item.title}
                            description=<CustomerDescription></CustomerDescription>
                        />
                    </List.Item>
                )}
            />
            <Button type="primary" htmlType="submit" style={buttonStyle}>
                Create Import List
            </Button>
        </div>
    )
};

export default AddImport;