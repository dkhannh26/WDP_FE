import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Form, List, Row } from "antd";
import React from "react";
import { createImport } from "../../../services/import.service";

// const { Option } = Select;

const AddImport = ({ data, setData }) => {
  const containerStyle = {
    maxWidth: "500px",
    margin: '30px auto',
    padding: "20px",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  };

  const titleStyle = {
    marginBottom: "20px",
    fontSize: "18px",
    fontWeight: "bold",
  };

  const buttonStyle = {
    width: "100%",
  };

  const CustomerDescription = ({ item }) => {
    const sizes = Object.keys(item);
    return (
      <Row>
        <Col span={20} style={{ paddingLeft: 30 }}>
          <ul style={{ fontSize: 17 }}>
            {sizes.map(
              (size) =>
                size !== "title" &&
                size != "category" && (
                  <li key={size}>
                    Size {size} - Quantity {item[size]}
                  </li>
                )
            )}
          </ul>
        </Col>
        <Col span={2}>
          <Button
            danger
            style={{
              marginRight: 5,
            }}
            shape="round"
            icon={<CloseOutlined />}
            onClick={() => handleClickX(item["title"])}
          ></Button>
        </Col>
      </Row>
    );
  };
  const handleClickX = (title) => {
    setData((prev) => {
      const newData = prev.filter((item) => item.title !== title);
      return newData;
    });
  };

  const handleAddImport = () => {
    createImport(data);
    setData([]);
  };
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Add Import</h3>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => {
          return (
            <List.Item>
              <List.Item.Meta
                style={{
                  textAlign: "left",
                }}
                title={item.title}
                description=<CustomerDescription item={item} />
              />
            </List.Item>
          );
        }}
      />
      <Button
        onClick={handleAddImport}
        type="primary"
        htmlType="submit"
        style={buttonStyle}
      >
        Create Import List
      </Button>
    </div>
  );
};

export default AddImport;
