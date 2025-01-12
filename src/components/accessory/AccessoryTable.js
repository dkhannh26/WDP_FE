import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Image, message, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_PATH } from "../../config/api.config";
import { MESSAGE } from "../../config/message.config";
import { ACCESSORY_URL } from "../../config/url.config";
import { showDeleteConfirm, success } from "../../utils/helper";
import { getListAccessory } from "../../services/product/accessory.service";

const AccessoryTable = () => {
  const [accessories, setAccessories] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const { state } = location;
  const role = localStorage.getItem("role");

  const columns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      width: "10%",
    },
    {
      title: "Image",
      dataIndex: "accessoryImg",
      render: (imgUrl) => {
        return (
          <Image width={150} src={"http://localhost:3000" + imgUrl}></Image>
        );
      },
      width: "20%",
    },
    {
      title: "Name",
      dataIndex: "accessoryName",
      filterSearch: true,
      width: "15%",
    },
    {
      title: "Price(VND)",
      dataIndex: "accessoryPrice",
      render: (price) => price.toLocaleString("vi-VN"),
      width: "20%",
    },
    {
      title: "Discount percent",
      dataIndex: "accessoryDiscountPercent",
      render: (percent) => {
        if (percent) return `${percent}%`;
        return "null";
      },
      width: "20%",
    },
    {
      title: "Action",
      dataIndex: "accessoryId",
      render: (_id) => {
        return role === "admin" ? (
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
                  getListAccessory,
                  setAccessories,
                  API_PATH.accessory
                )
              }
            ></Button>
          </Space>
        ) : (
          ""
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

    getListAccessory(setAccessories);
  }, [state, navigate, messageApi, location.pathname]);

  return (
    <>
      <Flex gap="middle" align="center" justify="space-between">
        {contextHolder}
        <Col>
          <Title level={2}>Accessory Management</Title>
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
          {role === "admin" ? (
            <Button onClick={() => navigate(ACCESSORY_URL.CREATE)}>
              Insert
            </Button>
          ) : (
            ""
          )}
        </Col>
      </Flex>
      <Table columns={columns} dataSource={accessories} />
    </>
  );
};

export default AccessoryTable;
