import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, message, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_PATH } from "../../config/api.config";
import { MESSAGE } from "../../config/message.config";
import { VOUCHER_URL } from "../../config/url.config";
import { getListVoucher } from "../../services/voucher.service";
import { showDeleteConfirm, success } from "../../utils/helper";

const VoucherTable = () => {
  const [vouchers, setVouchers] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const { state } = location;

  const columns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      width: "10%",
    },
    {
      title: "Sale off (VND)",
      dataIndex: "percent",
      sorter: (a, b) => a.percent - b.percent,
      width: "15%",
    },
    {
      title: "Condition",
      dataIndex: "condition",
      width: "20%",
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (_id) => {
        return (
          <Space>
            <Button
              shape="round"
              icon={<EditOutlined />}
              onClick={() => navigate(`edit/${_id}`)}
            ></Button>
            <Button
              danger
              shape="round"
              icon={<DeleteOutlined />}
              onClick={() =>
                showDeleteConfirm(
                  _id,
                  messageApi,
                  getListVoucher,
                  setVouchers,
                  API_PATH.voucher
                )
              }
            ></Button>
          </Space>
        );
      },
      width: "5%",
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

    getListVoucher(setVouchers);
  }, [state, navigate, messageApi, location.pathname]);

  return (
    <>
      <Flex gap="middle" align="center" justify="space-between">
        {contextHolder}
        <Col>
          <Title level={2}>Voucher Management</Title>
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
          <Button onClick={() => navigate(VOUCHER_URL.CREATE)}>Insert</Button>
        </Col>
      </Flex>
      <Table columns={columns} dataSource={vouchers} />
    </>
  );
};

export default VoucherTable;
