import { Checkbox, Col, Row, Space, Typography, Divider, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPermissionsByRole, updatePermission } from '../../services/permission.service';
import { useTranslation } from 'react-i18next';

const StaffPermission = () => {

    const [profileCheckedList, setProfileCheckedList] = useState([]);
    const [statisticCheckedList, setStatisticCheckedList] = useState([]);
    const [orderCheckedList, setOrderCheckedList] = useState([]);
    const [importCheckedList, setImportCheckedList] = useState([]);
    const { t } = useTranslation();

    const profileOptions = [
        { label: t('dashboard.edit_account'), value: 'editProfile' },
        { label: t('permission.delete_account'), value: 'deleteProfile' },
        { label: t('profile.change_pass'), value: 'changePassword' },
    ];

    const statisticOptions = [
        { label: t('permission.view_statistic'), value: 'viewStatistic' },
    ];

    const orderOptions = [
        { label: t('permission.delete_order'), value: 'deleteOrder' },
        { label: t('permission.confirm_order'), value: 'confirmOrder' },
        { label: t('permission.cancel_order'), value: 'cancelOrder' },
    ];

    const importOptions = [
        { label: t('permission.confirm_import'), value: 'confirmImport' },
    ];


    const mapPermissionsToCheckedList = (permissions) => {
        const profileChecked = profileOptions
            .filter(option => permissions[option.value])
            .map(option => option.value);
        const statisticChecked = statisticOptions
            .filter(option => permissions[option.value])
            .map(option => option.value);
        const orderChecked = orderOptions
            .filter(option => permissions[option.value])
            .map(option => option.value);
        const importChecked = importOptions
            .filter(option => permissions[option.value])
            .map(option => option.value);

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
        const allPermissions = {}

        profileOptions.forEach(option => {
            allPermissions[option.value] = profileCheckedList.includes(option.value);
        });
        statisticOptions.forEach(option => {
            allPermissions[option.value] = statisticCheckedList.includes(option.value);
        });
        orderOptions.forEach(option => {
            allPermissions[option.value] = orderCheckedList.includes(option.value);
        });
        importOptions.forEach(option => {
            allPermissions[option.value] = importCheckedList.includes(option.value);
        });

        return allPermissions;
    };

    const CheckboxSection = ({ title, options, checkedList, setCheckedList }) => {
        const onChange = (list) => {
            setCheckedList(list);
        };


        return (
            <>
                <Typography.Title level={3}>{title}</Typography.Title>
                <Col span={24}
                    style={{
                        textAlign: 'left'
                    }}
                >
                    <Checkbox.Group
                        value={checkedList}
                        onChange={onChange}
                        style={{
                            display: 'flex',
                            flexDirection: "column",
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            paddingLeft: 30,
                            fontSize: '20px',
                        }}
                    > {options.map((option) => (
                        <Checkbox
                            key={option.value}
                            value={option.value}
                            style={{
                                marginBottom: '20px',
                                height: '32px',
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>{option.label}</span>
                        </Checkbox>
                    ))}
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