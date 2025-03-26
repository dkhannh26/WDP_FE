import { Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TshirtSize = ({ error }) => {
    const { t } = useTranslation();
    
    return (
        <>
            <Form.Item
                name="S"
                label={t('table.quantity_of_size') + " S"} 
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
                label={t('table.quantity_of_size') + " M"} 
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
                label={t('table.quantity_of_size') + " L"} 
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
                label={t('table.quantity_of_size') + " XL"} 
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
                label={t('table.quantity_of_size') + " XXL"} 
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