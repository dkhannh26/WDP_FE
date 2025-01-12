import {
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Button, Col, Flex, message, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_URL, VOUCHER_URL } from "../../config/url.config";
import {
  showDeleteAccountConfirm,
  showDeletePermanently,
  showDeleteVoucherConfirm,
  showRecoveryAccount,
  success,
} from "../../utils/helper";
import { MESSAGE } from "../../config/message.config";
import {
  getListAccount,
  recoveryAccount,
} from "../../services/account.service";

const AccountTable = () => {
  const [account, setAccounts] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const { state } = location;
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
            <Button
              danger
              shape="round"
              icon={<DeleteFilled />}
              onClick={() =>
                showDeletePermanently(
                  _id,
                  messageApi,
                  getListAccount,
                  setAccounts
                )
              }
            ></Button>
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
      <Table columns={columns} dataSource={account} />
    </>
  );
};

export default AccountTable;
