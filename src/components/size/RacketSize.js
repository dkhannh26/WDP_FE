import { Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const RacketSize = ({ error }) => {
      const { t } = useTranslation();
    
    return (
        <>
            <Form.Item
                name="3U"
                label={t('table.quantity_of_size') + " 3U"} 
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
                label={t('table.quantity_of_size') + " 4U"}  
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