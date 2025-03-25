import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const SearchTable = ({ onSearch }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Search values:', values);
        onSearch(values);
    };

    const containerStyle = {
        maxWidth: '500px',
        margin: '0px auto',
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

    const formItemStyle = {
        marginBottom: '16px',
    };

    const labelStyle = {
        fontWeight: '500',
    };

    const inputPrefixStyle = {
        marginRight: '8px',
    };

    const buttonStyle = {
        width: '100%',
    };

    return (
        <div style={containerStyle}>
            <h3 style={titleStyle}>Search Table</h3>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label={<span style={labelStyle}>Type</span>}
                    name="type"
                    style={formItemStyle}
                >
                    <Select placeholder="Select type" allowClear>
                        <Option value="racket">Racket</Option>
                        <Option value="shoes">Shoes</Option>
                        <Option value="tshirt">T-shirt</Option>
                        <Option value="pant">Pants</Option>
                        <Option value="accessory">Accessory</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label={<span style={labelStyle}>Product Name</span>}
                    name="name"
                    style={formItemStyle}
                >
                    <Input
                        placeholder="Search here..."
                        prefix={<SearchOutlined style={inputPrefixStyle} />}
                    />
                </Form.Item>

                <Form.Item
                    label={<span style={labelStyle}>Status</span>}
                    name="status"
                    style={formItemStyle}
                >
                    <Select placeholder="Select status" allowClear>
                        <Option value="inStock">IN STOCK</Option>
                        <Option value="lowStock">LOW STOCK</Option>
                        <Option value="outOfStock">OUT OF STOCK</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={buttonStyle}>
                        Search
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SearchTable;