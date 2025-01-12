import { Card, Col, Row, Select } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";
import {
  getListTshirt,
  getListTshirtDecrease,
  getListTshirtIncrease,
} from "../../../services/product/tshirt.service";

const TshirtCustomer = () => {
  const [tshirts, setTshirts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getListTshirt(setTshirts);
  }, []);
  console.log(setTshirts);

  const handleFiterChange = (value) => {
    if (value === "increase") {
      getListTshirtIncrease(setTshirts);
    } else {
      getListTshirtDecrease(setTshirts);
    }
  };
  return (
    <Row>
      <Col offset={1} span={21}>
        <Title level={2} style={{ marginTop: "20px" }}>
          T-Shirt
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
          {tshirts.map((item) => {
            return (
              <Col span={6}>
                <Card
                  onClick={() => navigate(`${item.tshirtId}`)}
                  bordered={false}
                  hoverable
                  style={{ width: "95%", marginLeft: "5%" }}
                  cover={
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={`http://localhost:3000${item.tshirtImg}`}
                    />
                  }
                >
                  <Meta
                    title={item.tshirtName}
                    description={
                      <>
                        <p>
                          Giá gốc: {item.tshirtPrice.toLocaleString("vi-VN")}₫
                        </p>
                        {item.tshirtDiscountPercent ? (
                          <p>
                            Giá khuyến mãi:{" "}
                            {(
                              item.tshirtPrice -
                              (item.tshirtPrice * item.tshirtDiscountPercent) /
                                100
                            ).toLocaleString("vi-VN")}
                            ₫ (-{item.tshirtDiscountPercent}%)
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

export default TshirtCustomer;
