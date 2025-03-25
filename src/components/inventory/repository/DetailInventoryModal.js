import React from 'react';
import { List, Modal, Typography } from 'antd';
const DetailInventoryModal = ({ isModalOpen, handleCancel, inventoryDetail }) => {
    return (
        <>
            <Modal footer={null} title="Inventory Detail Model" open={isModalOpen} onCancel={handleCancel}>
                <p>Product Name: {inventoryDetail?.name}</p>
                <List
                    header={
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 16px',
                            background: '#f5f5f5',
                            fontWeight: 'bold'
                        }}>
                            <Typography.Text>Size name</Typography.Text>
                            <Typography.Text>Quantity</Typography.Text>
                        </div>
                    }
                    bordered
                    dataSource={inventoryDetail?.sizes}
                    renderItem={item => (
                        <List.Item
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '12px 16px'
                            }}
                        >
                            <Typography.Text strong>{item.size_name}</Typography.Text>
                            <Typography.Text type={item.quantity === 0 ? 'danger' : ''}>
                                {item.quantity}
                            </Typography.Text>
                        </List.Item>
                    )}
                    style={{ maxWidth: '400px', margin: '16px auto', borderRadius: '8px' }}
                />
            </Modal>
        </>
    );
};
export default DetailInventoryModal;