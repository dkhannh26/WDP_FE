import { Checkbox, Col, Row, Space, Typography, Divider, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPermissionsByRole, updatePermission } from '../../services/permission.service';

const profileOptions = [
    { name: 'Edit Profile', value: 'editProfile' },
    { name: 'Delete Profile', value: 'deleteProfile' },
    { name: 'Change Password', value: 'changePassword' },
];

const statisticOptions = [
    { name: 'View Statistic', value: 'viewStatistic' },
];

const orderOptions = [
    { name: 'Delete Order', value: 'deleteOrder' },
    { name: 'Confirm Order', value: 'confirmOrder' },
    { name: 'Cancel Order', value: 'cancelOrder' },
];

const importOptions = [
    { name: 'Confirm Import', value: 'confirmImport' },
];

const StaffPermission = () => {
    const [profileCheckedList, setProfileCheckedList] = useState([]);
    const [statisticCheckedList, setStatisticCheckedList] = useState([]);
    const [orderCheckedList, setOrderCheckedList] = useState([]);
    const [importCheckedList, setImportCheckedList] = useState([]);

    const mapPermissionsToCheckedList = (permissions) => {
        const profileChecked = profileOptions.filter(option => permissions[option.value]);
        const statisticChecked = statisticOptions.filter(option => permissions[option.value]);
        const orderChecked = orderOptions.filter(option => permissions[option.value]);
        const importChecked = importOptions.filter(option => permissions[option.value]);

        setProfileCheckedList(profileChecked);
        setStatisticCheckedList(statisticChecked);
        setOrderCheckedList(orderChecked);
        setImportCheckedList(importChecked);
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const permissions = await getPermissionsByRole('staff');
                console.log('Permissions from DB:', permissions);
                mapPermissionsToCheckedList(permissions); // Cập nhật state từ dữ liệu DB
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, []);

    const getPermissions = () => {
        const allPermissions = {
            editProfile: profileCheckedList.some((item) => item.value === 'editProfile'),
            deleteProfile: profileCheckedList.some((item) => item.value === 'deleteProfile'),
            changePassword: profileCheckedList.some((item) => item.value === 'changePassword'),
            viewStatistic: statisticCheckedList.some((item) => item.value === 'viewStatistic'),
            deleteOrder: orderCheckedList.some((item) => item.value === 'deleteOrder'),
            confirmOrder: orderCheckedList.some((item) => item.value === 'confirmOrder'),
            cancelOrder: orderCheckedList.some((item) => item.value === 'cancelOrder'),
            confirmImport: importCheckedList.some((item) => item.value === 'confirmImport'),
        };

        return allPermissions;
    };

    const CheckboxSection = ({ title, options, checkedList, setCheckedList }) => {
        const onChange = (list) => {
            setCheckedList(list);
        };


        return (
            <>
                <Typography.Title level={3}>{title}</Typography.Title>
                <Col span={8}>
                    <Checkbox.Group
                        value={checkedList}
                        onChange={onChange}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            paddingLeft: 30,
                            fontSize: '25px',
                        }}
                    >
                        <Space direction="vertical">
                            {options.map((option) => (
                                <Checkbox key={option.value} value={option}>
                                    {option.name}
                                </Checkbox>
                            ))}
                        </Space>
                    </Checkbox.Group>
                </Col>
                <Divider />
            </>
        );
    };

    const handleUpdate = async () => {
        const permissions = getPermissions();
        try {
            await updatePermission(permissions, 'staff');
            console.log('Permissions updated successfully:', permissions);
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    return (
        <div style={{ padding: '10px 60px', height: '60vh' }}>
            <Typography.Title>Staff Permission</Typography.Title>
            <Row>
                <Col span={12} style={{ textAlign: 'left' }}>
                    <CheckboxSection
                        title="Profile"
                        options={profileOptions}
                        checkedList={profileCheckedList}
                        setCheckedList={setProfileCheckedList}
                    />
                    <CheckboxSection
                        title="Statistic"
                        options={statisticOptions}
                        checkedList={statisticCheckedList}
                        setCheckedList={setStatisticCheckedList}
                    />
                </Col>
                <Col span={12} style={{ textAlign: 'left' }}>
                    <CheckboxSection
                        title="Order"
                        options={orderOptions}
                        checkedList={orderCheckedList}
                        setCheckedList={setOrderCheckedList}
                    />
                    <CheckboxSection
                        title="Import"
                        options={importOptions}
                        checkedList={importCheckedList}
                        setCheckedList={setImportCheckedList}
                    />
                </Col>
            </Row>
            <Row justify={'center'}>
                <Button type="primary" onClick={handleUpdate}>Update</Button>
            </Row>
        </div>
    );
};

export default StaffPermission;