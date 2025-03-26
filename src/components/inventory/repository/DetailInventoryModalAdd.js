import React, { useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  Row,
  Typography,
} from "antd";
const DetailInventoryModalAdd = ({
  isModalOpen,
  handleCancel,
  inventoryDetail,
  setData,
}) => {
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (sizeId, value) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      if (value !== null && !isNaN(value) && value >= 1) {
        newQuantities[sizeId] = value;
      } else {
        delete newQuantities[sizeId];
      }
      return newQuantities;
    });
  };

  const isValidQuantities = () => {
    const values = Object.values(quantities);
    return (
      values.length > 0 &&
      values.every((value) => typeof value === "number" && !isNaN(value))
    );
  };

  const handleAddToList = () => {
    if (!isValidQuantities()) {
      message.error("Please enter valid numbers for all quantities!");
      return;
    }

    quantities["title"] = inventoryDetail.name;
    quantities["category"] = inventoryDetail.category;
    setData((prev) => [...prev, { ...quantities }]);
    setQuantities({});
    handleCancel();
  };
  return (
    <>
      <Modal
        footer={null}
        title="Inventory Detail Add"
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <p>Product Name: {inventoryDetail?.name}</p>
        <List
          header={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 16px",
                background: "#f5f5f5",
                fontWeight: "bold",
              }}
            >
              <Typography.Text>Size name</Typography.Text>
              <Typography.Text>Quantity</Typography.Text>
            </div>
          }
          bordered
          dataSource={inventoryDetail?.sizes}
          renderItem={(item) => (
            <List.Item
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
              }}
            >
              <Typography.Text strong>{item.size_name}</Typography.Text>
              <InputNumber
                min={1}
                max={1000}
                value={quantities[item.size_name] || 0}
                onChange={(value) =>
                  handleQuantityChange(item.size_name, value)
                }
              />
            </List.Item>
          )}
          style={{
            maxWidth: "400px",
            margin: "16px auto",
            borderRadius: "8px",
          }}
        />
        <Row justify={"center"}>
          <Button
            onClick={handleAddToList}
            style={{ width: "300px" }}
            disabled={!isValidQuantities()}
            color="default"
            variant="solid"
          >
            Add to list
          </Button>
        </Row>
      </Modal>
    </>
  );
};
export default DetailInventoryModalAdd;
