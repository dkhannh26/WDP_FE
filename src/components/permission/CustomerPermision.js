import { Checkbox, Col, Row, Space, Typography, Divider, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPermissionsByRole, updatePermission } from '../../services/permission.service';
import { useTranslation } from 'react-i18next';

const CustomerPermission = () => {
    const [profileCheckedList, setProfileCheckedList] = useState([]);
    const [feedbackCheckedList, setFeedbackCheckedList] = useState([]);
    const [orderCheckedList, setOrderCheckedList] = useState([]);
    const { t } = useTranslation();

    const profileOptions = [
        { label: t('dashboard.edit_account'), value: 'editProfile' },
        { label: t('profile.change_pass'), value: 'changePassword' },
        { label: t('header.forget_password'), value: 'forgotPassword' },
    ];

    const feedbackOptions = [
        { label: t('feedback.view'), value: 'viewFeedbacks' },
        { label: t('feedback.write'), value: 'createFeedback' },
        { label: t('feedback.edit'), value: 'editFeedback' },
        { label: t('feedback.delete'), value: 'deleteFeedback' },
    ];

    const orderOptions = [
        { label: t('header.payment'), value: 'checkout' },
        { label: t('product.add_to_cart'), value: 'addProductToCart' },
    ];

    const mapPermissionsToCheckedList = (permissions) => {
        const profileChecked = profileOptions
            .filter(option => permissions[option.value])
            .map(option => option.value);
        const feedbackChecked = feedbackOptions
            .filter(option => permissions[option.value])
            .map(option => option.value);
        const orderChecked = orderOptions
            .filter(option => permissions[option.value])
            .map(option => option.value);

        setProfileCheckedList(profileChecked);
        setFeedbackCheckedList(feedbackChecked);
        setOrderCheckedList(orderChecked);
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const permissions = await getPermissionsByRole('customer');
                console.log('Permissions from DB:', permissions);
                mapPermissionsToCheckedList(permissions);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, []);

    const getPermissions = () => {
        const allPermissions = {};

        profileOptions.forEach(option => {
            allPermissions[option.value] = profileCheckedList.includes(option.value);
        });
        feedbackOptions.forEach(option => {
            allPermissions[option.value] = feedbackCheckedList.includes(option.value);
        });
        orderOptions.forEach(option => {
            allPermissions[option.value] = orderCheckedList.includes(option.value);
        });

        return allPermissions;
    };

    const CheckboxSection = ({ title, options, checkedList, setCheckedList }) => {
        const onChange = (checkedValues) => {
            setCheckedList(checkedValues);
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
            </>
        );
    };

    const handleUpdate = async () => {
        const permissions = getPermissions();
        try {
            await updatePermission(permissions, 'customer');
            console.log('Permissions updated successfully:', permissions);
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    return (
        <div style={{ padding: '10px 60px' }}>
            <Typography.Title>{t('permission.customer')}</Typography.Title>
            <Row gutter={[16, 16]} align="top">
                <Col span={12} style={{ textAlign: 'left' }}>
                    <CheckboxSection
                        title={t('table.account')}
                        options={profileOptions}
                        checkedList={profileCheckedList}
                        setCheckedList={setProfileCheckedList}
                    />
                    <Divider />
                    <CheckboxSection
                        title="Order"
                        options={orderOptions}
                        checkedList={orderCheckedList}
                        setCheckedList={setOrderCheckedList}
                    />
                </Col>
                <Col span={12} style={{ textAlign: 'left' }}>
                    <CheckboxSection
                        title="Feedback"
                        options={feedbackOptions}
                        checkedList={feedbackCheckedList}
                        setCheckedList={setFeedbackCheckedList}
                    />
                </Col>
            </Row>
            <Divider />
            <Row justify="center">
                <Button type="primary" onClick={handleUpdate}>
                    {t('button.update')}
                </Button>
            </Row>
        </div>
    );
};

export default CustomerPermission;