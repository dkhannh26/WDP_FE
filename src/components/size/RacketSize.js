import { Form, Input } from 'antd';
import React from 'react';

const RacketSize = ({ error }) => {
    return (
        <>
            <Form.Item
                name="3U"
                label="Quantity of size 3U"
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
                name="4U"
                label="Quantity of size 4U"
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

export default RacketSize;