import { Checkbox, Col, Row, Space, Typography, Divider, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPermissionsByRole, updatePermission } from '../../services/permission.service';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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

    const profileOptions = [
        { name: t('dashboard.edit_account'), value: 'editProfile' },
        { name: t('permission.delete_account'), value: 'deleteProfile' },
        { name: t('profile.change_pass'), value: 'changePassword' },
    ];
    
    const statisticOptions = [
        { name: t('permission.view_statistic'), value: 'viewStatistic' },
    ];
    
    const orderOptions = [
        { name: t('permission.delete_order'), value: 'deleteOrder' },
        { name: t('permission.confirm_order'), value: 'confirmOrder' },
        { name: t('permission.cancel_order'), value: 'cancelOrder' },
    ];
    
    const importOptions = [
        { name: t('permission.confirm_import'), value: 'confirmImport' },
    ];

    return (
        <div style={{ padding: '10px 60px', height: '60vh' }}>
            <Typography.Title>{t('permission.staff')}</Typography.Title>
            <Row>
                <Col span={12} style={{ textAlign: 'left' }}>
                    <CheckboxSection
                        title={t('table.account')}
                        options={profileOptions}
                        checkedList={profileCheckedList}
                        setCheckedList={setProfileCheckedList}
                    />
                    <CheckboxSection
                        title={t('permission.statistic')}
                        options={statisticOptions}
                        checkedList={statisticCheckedList}
                        setCheckedList={setStatisticCheckedList}
                    />
                </Col>
                <Col span={12} style={{ textAlign: 'left' }}>
                    <CheckboxSection
                        title={t('profile.order')}
                        options={orderOptions}
                        checkedList={orderCheckedList}
                        setCheckedList={setOrderCheckedList}
                    />
                    <CheckboxSection
                        title={t('permission.import')}
                        options={importOptions}
                        checkedList={importCheckedList}
                        setCheckedList={setImportCheckedList}
                    />
                </Col>
            </Row>
            <Row justify={'center'}>
                <Button type="primary" onClick={handleUpdate}>{t('button.update')}</Button>
            </Row>
        </div>
    );
};

export default StaffPermission;