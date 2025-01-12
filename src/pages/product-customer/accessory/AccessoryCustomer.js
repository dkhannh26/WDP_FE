import { Card, Col, Row, Select } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";
import {
  getListAccessory,
  getListAccessoryDecrease,
  getListAccessoryIncrease,
} from "../../../services/product/accessory.service";

const AccessoryCustomer = () => {
  const [accessories, setAccessories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getListAccessory(setAccessories);
  }, []);

  const handleFiterChange = (value) => {
    if (value === "increase") {
      getListAccessoryIncrease(setAccessories);
    } else {
      getListAccessoryDecrease(setAccessories);
    }
  };
  return (
    <Row>
      <Col offset={1} span={21}>
        <Title level={2} style={{ marginTop: "20px" }}>
          Accessories
        </Title>
        <Row style={{ margin: "20px", marginLeft: 0 }}>
          <div className="product-filter">
            <FilterOutlined /> Filter
            <Select
              defaultValue="Price"
              style={{
                marginLeft: 20,
              }}
              onChange={handleFiterChange}
              options={[
                {
                  value: "increase",
                  label: "Increase",
                },
                {
                  value: "decrease",
                  label: "Decrease",
                },
              ]}
            />
          </div>
        </Row>
        <Row>
          {accessories.map((item) => {
            return (
              <Col span={6}>
                <Card
                  onClick={() => navigate(`${item.accessoryId}`)}
                  bordered={false}
                  hoverable
                  style={{ width: "95%", marginLeft: "5%" }}
                  cover={
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={`http://localhost:3000${item.accessoryImg}`}
                    />
                  }
                >
                  <Meta
                    title={item.accessoryName}
                    description={
                      <>
                        <p>
                          Giá gốc: {item.accessoryPrice.toLocaleString("vi-VN")}
                          ₫
                        </p>
                        {item.accessoryDiscountPercent ? (
                          <p>
                            Giá khuyến mãi:{" "}
                            {(
                              item.accessoryPrice -
                              (item.accessoryPrice *
                                item.accessoryDiscountPercent) /
                                100
                            ).toLocaleString("vi-VN")}
                            ₫ (-{item.accessoryDiscountPercent}%)
                          </p>
                        ) : (
                          <p>Chưa có khuyến mãi</p>
                        )}
                      </>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
};

export default AccessoryCustomer;
