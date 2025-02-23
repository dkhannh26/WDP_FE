import { Form, Input } from 'antd';
import React from 'react';

const TshirtSize = ({ error }) => {
    return (
        <>
            <Form.Item
                name="S"
                label="Quantity of size S"
                validateStatus={error ? 'error' : ''}
                help={error ? error : null}
                rules={[
                    {
                        required: true,
                    }
                ]}
            >
                <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="M"
                label="Quantity of size M"
                validateStatus={error ? 'error' : ''}
                help={error ? error : null}
                rules={[
                    {
                        required: true,
                    }
                ]}
            >
                <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="L"
                label="Quantity of size L"
                validateStatus={error ? 'error' : ''}
                help={error ? error : null}
                rules={[
                    {
                        required: true,
                    }
                ]}
            >
                <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="XL"
                label="Quantity of size XL"
                validateStatus={error ? 'error' : ''}
                help={error ? error : null}
                rules={[
                    {
                        required: true,
                    }
                ]}
            >
                <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="XXL"
                label="Quantity of size XXL"
                validateStatus={error ? 'error' : ''}
                help={error ? error : null}
                rules={[
                    {
                        required: true,
                    }
                ]}
            >
                <Input style={{ width: '100%' }} />
            </Form.Item>
        </>

    );
};

export default TshirtSize;