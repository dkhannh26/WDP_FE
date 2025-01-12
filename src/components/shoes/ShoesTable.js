import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Image, message, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_PATH } from "../../config/api.config";
import { MESSAGE } from "../../config/message.config";
import { SHOES_URL } from "../../config/url.config";
import { getListShoes } from "../../services/product/shoes.service";
import { showDeleteConfirm, success } from "../../utils/helper";

const ShoesTable = () => {
  const [shoesList, setShoesList] = useState([]);
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
      dataIndex: "shoesImg",
      render: (imgUrl) => {
        return (
          <Image width={150} src={"http://localhost:3000" + imgUrl}></Image>
        );
      },
      width: "20%",
    },
    {
      title: "Name",
      dataIndex: "shoesName",
      filterSearch: true,
      width: "15%",
    },
    {
      title: "Price(VND)",
      dataIndex: "shoesPrice",
      render: (price) => price?.toLocaleString("vi-VN"),
      width: "20%",
    },
    {
      title: "Discount percent",
      dataIndex: "shoesDiscountPercent",
      render: (percent) => {
        if (!percent) return "null";
        return `${percent}%`;
      },
      width: "20%",
    },
    {
      title: "Action",
      dataIndex: "shoesId",
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
                  getListShoes,
                  setShoesList,
                  API_PATH.shoes
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

    getListShoes(setShoesList);
  }, [state, navigate, messageApi, location.pathname]);

  return (
    <>
      <Flex gap="middle" align="center" justify="space-between">
        {contextHolder}
        <Col>
          <Title level={2}>Shoes Management</Title>
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
            <Button onClick={() => navigate(SHOES_URL.CREATE)}>Insert</Button>
          ) : (
            ""
          )}
        </Col>
      </Flex>
      <Table columns={columns} dataSource={shoesList} />
    </>
  );
};

export default ShoesTable;
