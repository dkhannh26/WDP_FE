import { Card, Col, Row, Select } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";
import {
  getListShoes,
  getListShoesDecrease,
  getListShoesIncrease,
} from "../../../services/product/shoes.service";

const ShoesCustomer = () => {
  const [shoesList, setShoesList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getListShoes(setShoesList);
  }, []);
  console.log(shoesList);

  const handleFiterChange = (value) => {
    if (value === "increase") {
      getListShoesIncrease(setShoesList);
    } else {
      getListShoesDecrease(setShoesList);
    }
  };
  return (
    <Row>
      <Col offset={1} span={21}>
        <Title level={2} style={{ marginTop: "20px" }}>
          Shoes
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
          {shoesList.map((item) => {
            return (
              <Col span={6}>
                <Card
                  onClick={() => navigate(`${item.shoesId}`)}
                  bordered={false}
                  hoverable
                  style={{ width: "95%", marginLeft: "5%" }}
                  cover={
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={`http://localhost:3000${item.shoesImg}`}
                    />
                  }
                >
                  <Meta
                    title={item.shoesName}
                    description={
                      <>
                        <p>
                          Giá gốc: {item.shoesPrice.toLocaleString("vi-VN")}₫
                        </p>
                        {item.shoesDiscountPercent ? (
                          <p>
                            Giá khuyến mãi:{" "}
                            {(
                              item.shoesPrice -
                              (item.shoesPrice * item.shoesDiscountPercent) /
                                100
                            ).toLocaleString("vi-VN")}
                            ₫ (-{item.shoesDiscountPercent}%)
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

export default ShoesCustomer;
