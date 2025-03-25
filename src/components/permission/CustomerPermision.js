import { Checkbox, Col, Row, Space, Typography, Divider, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPermissionsByRole, updatePermission } from '../../services/permission.service';
import { useTranslation } from 'react-i18next';

const CustomerPermission = () => {
    const [profileCheckedList, setProfileCheckedList] = useState([]);
    const [feedbackCheckedList, setFeedbackCheckedList] = useState([]);

    const mapPermissionsToCheckedList = (permissions) => {
        const profileChecked = profileOptions.filter(option => permissions[option.value]);
        const feedbackChecked = feedbackOptions.filter(option => permissions[option.value]);

        setProfileCheckedList(profileChecked);
        setFeedbackCheckedList(feedbackChecked);
    };
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const permissions = await getPermissionsByRole('customer');
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
            forgotPassword: profileCheckedList.some((item) => item.value === 'forgotPassword'),
            viewFeedbacks: feedbackCheckedList.some((item) => item.value === 'viewFeedbacks'),
            editFeedback: feedbackCheckedList.some((item) => item.value === 'editFeedback'),
            deleteFeedback: feedbackCheckedList.some((item) => item.value === 'deleteFeedback'),
            createFeedback: feedbackCheckedList.some((item) => item.value === 'createFeedback'),
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

    const profileOptions = [
        { name: t('dashboard.edit_account'), value: 'editProfile' },
        { name: t('profile.change_pass'), value: 'changePassword' },
        { name: t('header.forget_password'), value: 'forgotPassword' },
    ];
    
    const feedbackOptions = [
        { name: t('feedback.view'), value: 'viewFeedbacks' },
        { name: t('feedback.write'), value: 'createFeedback' },
        { name: t('feedback.edit'), value: 'editFeedback' },
        { name: t('feedback.delete'), value: 'deleteFeedback' },
    ];

    return (
        <div style={{ padding: '10px 60px', height: '60vh' }}>
            <Typography.Title>{t('permission.customer')}</Typography.Title>
            <Row>
                <Col span={12} style={{ textAlign: 'left' }}>
                    <CheckboxSection
                        title={t('table.account')}
                        options={profileOptions}
                        checkedList={profileCheckedList}
                        setCheckedList={setProfileCheckedList}
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
            <Row justify={'center'}>
                <Button type="primary" onClick={handleUpdate}>{t('button.update')}</Button>
            </Row>
        </div>
    );
};

export default CustomerPermission;