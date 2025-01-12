import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Image, message, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_PATH } from "../../config/api.config";
import { MESSAGE } from "../../config/message.config";
import { TSHIRT_URL } from "../../config/url.config";
import { getListTshirt } from "../../services/product/tshirt.service";
import { showDeleteConfirm, success } from "../../utils/helper";

const TshirtTable = () => {
  const [tshirts, setTshirts] = useState([]);
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
      dataIndex: "tshirtImg",
      render: (imgUrl) => {
        console.log(imgUrl);
        return (
          <Image width={150} src={"http://localhost:3000" + imgUrl}></Image>
        );
      },
      width: "20%",
    },
    {
      title: "Name",
      dataIndex: "tshirtName",
      filterSearch: true,
      width: "15%",
    },
    {
      title: "Price(VND)",
      dataIndex: "tshirtPrice",
      render: (price) => price.toLocaleString("vi-VN"),
      width: "20%",
    },
    {
      title: "Discount percent",
      dataIndex: "tshirtDiscountPercent",
      render: (percent) => {
        if (percent) return `${percent}%`;
        return "null";
      },
      width: "20%",
    },
    {
      title: "Action",
      dataIndex: "tshirtId",
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
                  getListTshirt,
                  setTshirts,
                  API_PATH.tshirt
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

    getListTshirt(setTshirts);
  }, [state, navigate, messageApi, location.pathname]);

  return (
    <>
      <Flex gap="middle" align="center" justify="space-between">
        {contextHolder}
        <Col>
          <Title level={2}>T-shirt Management</Title>
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
            <Button onClick={() => navigate(TSHIRT_URL.CREATE)}>Insert</Button>
          ) : (
            ""
          )}
        </Col>
      </Flex>
      <Table columns={columns} dataSource={tshirts} />
    </>
  );
};

export default TshirtTable;
