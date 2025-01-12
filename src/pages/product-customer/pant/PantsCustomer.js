import { Card, Col, Row, Select } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import {
  getListPant,
  getListPantDecrease,
  getListPantIncrease,
} from "../../../services/product/pant.service";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";

const PantsCustomer = () => {
  const [pants, setPants] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getListPant(setPants);
  }, []);

  const handleFiterChange = (value) => {
    if (value === "increase") {
      getListPantIncrease(setPants);
    } else {
      getListPantDecrease(setPants);
    }
  };
  return (
    <Row>
      <Col offset={1} span={21}>
        <Title level={2} style={{ marginTop: "20px" }}>
          Pants
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
          {pants.map((pant) => {
            return (
              <Col span={6}>
                <Card
                  onClick={() => navigate(`${pant.pantId}`)}
                  bordered={false}
                  hoverable
                  style={{ width: "95%", marginLeft: "5%" }}
                  cover={
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={`http://localhost:3000${pant.pantImg}`}
                    />
                  }
                >
                  <Meta
                    title={pant.pantName}
                    description={
                      <>
                        <p>
                          Giá gốc: {pant.pantPrice.toLocaleString("vi-VN")}₫
                        </p>
                        {pant.pantDiscountPercent ? (
                          <p>
                            Giá khuyến mãi:{" "}
                            {(
                              pant.pantPrice -
                              (pant.pantPrice * pant.pantDiscountPercent) / 100
                            ).toLocaleString("vi-VN")}
                            ₫ (-{pant.pantDiscountPercent}%)
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

export default PantsCustomer;
