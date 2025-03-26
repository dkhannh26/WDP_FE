import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Button, Col, Flex, message, Row, Select, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MESSAGE } from "../../config/message.config";
import { ACCOUNT_URL } from "../../config/url.config";
import { getListAccount } from "../../services/account.service";
import {
  showDeleteAccountConfirm,
  showRecoveryAccount,
  success,
} from "../../utils/helper";
import { Input } from "antd";
import { useTranslation } from "react-i18next";

 
const { Search } = Input;

const AccountTable = () => {
  const [account, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState(account);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const { state } = location;
  const onChange = (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = account.filter(
      (account) =>
        account?.username?.toLowerCase().includes(value) ||
        account?.email?.toLowerCase().includes(value) ||
        account?.phone?.toLowerCase().includes(value) ||
        account?.address?.toLowerCase().includes(value)
    );
    setFilteredAccounts(filtered);
  };

  const handleFilterChange = (value) => {
    let filtered = [];
    switch (value) {
      case "user":
      case "staff":
        filtered = account.filter((item) => item.role === value);
        break;
      case "active":
        filtered = account.filter((item) => item.deleted === "false");
        break;
      case "locked":
        filtered = account.filter((item) => item.deleted === "true");
        break;
    }
    setFilteredAccounts(filtered);
  };

  const columns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      width: "5%",
    },
    {
      title: t('profile.username'),
      dataIndex: "username",
      sorter: (a, b) => a.percent - b.percent,
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: t('table.role'),
      dataIndex: "role",
      width: "10%",
    },
    {
      title: t('table.address'),
      dataIndex: "address",
      width: "15%",
    },
    {
      title: t('table.phone'),
      dataIndex: "phone",
      width: "15%",
    },
    {
      title: t('table.locked'),
      dataIndex: "deleted",
      width: "10%",
    },
    {
      title: t('table.action'),
      dataIndex: "_id",
      render: (_id, record) => {
        return (
          <Space>
            {record.deleted === "false" ? (
              <>
                <Button
                  danger
                  shape="round"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    showDeleteAccountConfirm(
                      _id,
                      messageApi,
                      getListAccount,
                      setAccounts
                    )
                  }
                ></Button>

                <Button
                  shape="round"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`edit/${_id}`)}
                ></Button>
              </>
            ) : (
              <Button
                shape="round"
                icon={<UndoOutlined />}
                onClick={() =>
                  showRecoveryAccount(
                    _id,
                    messageApi,
                    getListAccount,
                    setAccounts
                  )
                }
              ></Button>
            )}
          </Space>
        );
      },
      width: "10%",
    },
  ];
  useEffect(() => {
    if (state?.message === MESSAGE.CREATE_SUCCESS) {
      console.log("message", state?.message);
      success(state.message, messageApi);
      navigate(location.pathname, { replace: true }); //xóa state sau khi sử dụng
    } else if (state?.message === MESSAGE.UPDATE_SUCCESS) {
      console.log("message", state?.message);
      success(state.message, messageApi);
      navigate(location.pathname, { replace: true });
    }
    getListAccount(setAccounts);
  }, [state, navigate, messageApi, location.pathname]);

  useEffect(() => {
    if (account.length > 0) {
      setFilteredAccounts(account);
    }
  }, [account]);
  return (
    <>
      <Flex gap="middle" align="center" justify="space-between">
        {contextHolder}
        <Col>
          <Title level={2}>{t('dashboard.account_mng')}</Title>
        </Col>
        <Col
          className="gutter-row"
          style={{
            display: "flex",
            justifyContent: "flex-end  !important",
            alignItems: "center !important",
            height: "100%",
          }}
        >
          <Button onClick={() => navigate(ACCOUNT_URL.CREATE)}>
          {t('button.add_staff_account')}
          </Button>
        </Col>
      </Flex>

      <Row style={{ marginLeft: 0 }}>
        <Col span={6}>
          <Search
            placeholder={t('search.something')}
            allowClear
            enterButton
            size="large"
            onChange={onChange}
            style={{
              width: 350,
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "10px",
            }}
          />
        </Col>
        <Col span={6}>
          <div style={{ fontWeight: 600, fontSize: 20 }}>
            <FilterOutlined /> {t('filter')}
            <Select
              defaultValue={t('table.role')}
              style={{
                marginLeft: 20,
                width: 120,
              }}
              onChange={handleFilterChange}
            >
              <Select.OptGroup label={t('table.role')}>
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="staff">Staff</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label={t('table.status')}>
                <Select.Option value="active">{t('table.active')}</Select.Option>
                <Select.Option value="deleted">{t('table.locked')}</Select.Option>
              </Select.OptGroup>
            </Select>
          </div>
        </Col>
      </Row>

      <Table columns={columns} dataSource={filteredAccounts} />
    </>
  );
};

export default AccountTable;