import { Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ShoesSize = ({ error }) => {
    const { t } = useTranslation();

    return (
        <>
            <Form.Item
                name="37"
                label={t('table.quantity_of_size') + " 37"} 
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
                name="38"
                label={t('table.quantity_of_size') + " 38"} 
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
                name="39"
                label={t('table.quantity_of_size') + " 39"} 
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
                name="40"
                label={t('table.quantity_of_size') + " 40"} 
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
                name="41"
                label={t('table.quantity_of_size') + " 41"} 
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
                name="42"
                label={t('table.quantity_of_size') + " 42"} 
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
                name="43"
                label={t('table.quantity_of_size') + " 43"} 
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

export default ShoesSize;