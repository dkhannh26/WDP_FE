import { Card, Col, Row, Select } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FilterOutlined } from "@ant-design/icons";
import {
  getListTshirtDecrease,
  getListTshirtIncrease,
} from "../../services/product/tshirt.service";
import { getProductList } from "../../services/product/product.service";

const ProductCustomer = () => {
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProductList(setProducts, state?.typeLink)
  }, [state]);

  const handleFiterChange = (value) => {
    if (value === "increase") {
      const sortedAscending = sortProductsByPrice(products, 'asc');
      setProducts(sortedAscending);
    } else {
      const sortedDescending = sortProductsByPrice(products, 'desc');
      setProducts(sortedDescending);
    }
  };


  const sortProductsByPrice = (products, order = 'asc') => {
    const sortedProducts = [...products].sort((a, b) => {
      if (order === 'asc') return a.productPrice - b.productPrice;
      if (order === 'desc') return b.productPrice - a.productPrice;
      return 0;
    });
    return sortedProducts;
  };

  return (
    <Row>
      <Col offset={1} span={21}>
        <Title level={2} style={{ marginTop: "20px" }}>
          {state?.typeLink === "tshirt" && "T-shirt"}
          {state?.typeLink === "pant" && "Pant"}
          {state?.typeLink === "shoes" && "Shoes"}
          {state?.typeLink === "accessory" && "Accessory"}
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
          {products.map((item) => {
            return (
              <Col span={6}>
                <Card
                  onClick={() => navigate(`${item.productId}`)}
                  bordered={false}
                  hoverable
                  style={{ width: "95%", marginLeft: "5%" }}
                  cover={
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={`http://localhost:3000${item.productImg}`}
                    />
                  }
                >
                  <Meta
                    title={item.productName}
                    description={
                      <>
                        <p>
                          Giá gốc: {item.productPrice.toLocaleString("vi-VN")}₫
                        </p>
                        {item.productDiscountPercent ? (
                          <p>
                            Giá khuyến mãi:{" "}
                            {(
                              item.productPrice -
                              (item.productPrice * item.productDiscountPercent) /
                              100
                            ).toLocaleString("vi-VN")}
                            ₫ (-{item.productDiscountPercent}%)
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

export default ProductCustomer;
