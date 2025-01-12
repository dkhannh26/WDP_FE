import { CheckOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Col, Flex, message, Modal, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MESSAGE } from "../../config/message.config";
import { IMPORT_URL } from "../../config/url.config";
import {
  confirmImport,
  getDetailImport,
  getListImport,
} from "../../services/import.service";
import { showDeleteImportConfirm, success } from "../../utils/helper";

const ImportTable = () => {
  const [discounts, setDiscounts] = useState([]);
  const [imports, setImports] = useState([]);
  const [importDetail, setImportDetail] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const { state } = location;
  const [isModalVisible, setIsModalVisible] = useState(false);
  let role = localStorage.getItem("role");
  console.log(role);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      width: "10%",
    },
    {
      title: "Staff Confirmed",
      dataIndex: "confirm",

      width: "15%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",

      width: "15%",
    },

    {
      title: "Status",
      dataIndex: "status",

      width: "20%",
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (_id, record) => {
        return (
          <Space>
            {record.confirm === undefined ? (
              role === "staff" ? (
                <Button
                  shape="round"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    confirmImport(_id, navigate);
                  }}
                ></Button>
              ) : (
                <Button
                  danger
                  shape="round"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    showDeleteImportConfirm(
                      _id,
                      messageApi,
                      getListImport,
                      setImports
                    )
                  }
                ></Button>
              )
            ) : (
              ""
            )}

            <Button
              shape="round"
              icon={<EyeOutlined />}
              onClick={() => {
                getDetailImport(setImportDetail, _id);
                showModal();
              }}
            ></Button>
          </Space>
        );
      },
      width: "10%",
    },
  ];

  const columnDetail = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",

      width: "15%",
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "15%",
    },
    {
      title: "Size",
      dataIndex: "size",
      width: "10%",
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
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

    // console.log(importDetail);

    getListImport(setImports);
  }, [state, navigate, messageApi, location.pathname]);

  return (
    <>
      <Flex gap="middle" align="center" justify="space-between">
        {contextHolder}
        <Col>
          <Title level={2}>Import Management</Title>
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
            <Button onClick={() => navigate(IMPORT_URL.CREATE)}>Insert</Button>
          ) : (
            ""
          )}
        </Col>
      </Flex>
      <Table columns={columns} dataSource={imports} />

      <Modal
        title="Data Table"
        onOk={handleOk}
        open={isModalVisible}
        onCancel={handleCancel}
        width={800} // Customize the modal width if needed
      >
        <Table
          dataSource={importDetail}
          columns={columnDetail}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default ImportTable;
