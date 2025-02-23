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

const { Search } = Input;

const AccountTable = () => {
  const [account, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState(account);

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
      title: "Username",
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
      title: "Role",
      dataIndex: "role",
      width: "10%",
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "15%",
    },
    {
      title: "Phone number",
      dataIndex: "phone",
      width: "15%",
    },
    {
      title: "Is Deleted",
      dataIndex: "deleted",
      width: "10%",
    },
    {
      title: "Action",
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
          <Title level={2}>Account Management</Title>
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
            Add staff account
          </Button>
        </Col>
      </Flex>

      <Row style={{ marginLeft: 0 }}>
        <Col span={6}>
          <Search
            placeholder="Enter something to search"
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
            <FilterOutlined /> Filter
            <Select
              defaultValue="Role"
              style={{
                marginLeft: 20,
              }}
              onChange={handleFilterChange}
            >
              <Select.OptGroup label="Role">
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="staff">Staff</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label="Status">
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="deleted">Locked</Select.Option>
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