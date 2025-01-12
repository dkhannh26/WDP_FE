import React, { useEffect } from "react";

import {
  DownOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Col,
  Empty,
  Image,
  List,
  Menu,
  Popover,
  Row,
  message,
  Typography,
  InputNumber,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/header.css";
import { getSearchList } from "../services/product/search.service";
import LoginPopover from "./login";
import { CART_URL, PAYMENT_URL } from "../config/url.config";
import { API_PATH, PATH } from "../config/api.config";
import { getListCart } from "../services/cart.service";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import "../assets/css/header.css";
import Logo from "../assets/images/logo.webp";
import Logo2 from "../assets/images/logo2.jpeg";
const { Text } = Typography;

const Header = () => {
  const [searchFocus, setSearchForcus] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [isCheck, setIsCheck] = useState();
  const [carts, setCarts] = useState([]);
  const [voucher, setVoucher] = useState([]);
  // const [messageApi, contextHolder] = message.useMessage(null)
  const [totalAmount, setTotalAmount] = useState(Number);
  const [total, setTotal] = useState(Number);
  const [initialTotal, setInitialTotal] = useState(0);

  const { isAuthenticated, username, user } = useAuth();
  const [initialValues, setInitialValues] = useState({
    userId: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        await axios
          .get(`${PATH.profile}/${user.username}`)
          .then((res) => {
            setInitialValues({
              userId: res.data.user._id,
              username: res?.data?.user?.username,
              email: res?.data?.user?.email,
              phone: res?.data?.user?.phone,
              address: res?.data?.user?.address,
            });
          })
          .catch((error) => console.error("Error fetching data:", error));
      }
    };

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (initialValues.userId) {
      getListCart(initialValues.userId, setCarts, (total) => {
        setTotal(total);
        setInitialTotal(total);
      });
      setIsCheck(null);
    }
  }, [totalAmount, initialValues.userId]);
  console.log(initialValues.userId);
  const cartPopover = (
    <div className="cart-pop">
      <div className="card-pop-title text">
        <p>GIỎ HÀNG</p>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={carts}
        renderItem={(item) => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={
                  item.productImage ? (
                    <Image
                      width={100}
                      src={`${API_PATH.image}/${item.product.product_id}/${item.productImage._id}${item.productImage.file_extension}`}
                    />
                  ) : (
                    // {`${API_PATH.image}/${item.product.product_id}/${item.productImage._id}${item.productImage.file_extension}`}
                    // <span>{item.productImage ? item.productImage._id : "default extension"}</span>

                    <Image width={100} src="path-to-default-image" />
                    // <span>{item.productImage ? item.productImage.file_extension : "default extension"}</span>
                  )
                }
                title={
                  <Text
                    style={{
                      display: "block",
                      textAlign: "left",
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.product.name}
                  </Text>
                }
                description={
                  <div
                    style={{
                      marginTop: "5px",
                      display: "block",
                      textAlign: "left",
                    }}
                  >
                    <Text style={{ color: "#888" }}>
                      {(item.product.price * item.quantity).toLocaleString()}
                      <Text
                        style={{
                          fontSize: "10px",
                          color: "#888",
                          textDecorationLine: "underline",
                        }}
                      >
                        đ
                      </Text>
                    </Text>
                    <br />
                    <Text style={{ color: "#888" }}>
                      Kích thước:{" "}
                      {item.productSize
                        ? item.productSize.size_name
                        : "Không có kích thước"}
                    </Text>
                    <br />
                    {/* <InputNumber min={1} max={item.product.quantity} defaultValue={Math.min(item.quantity, item.product.quantity)} onChange={(value) => onChange(value, item._id)} /> */}
                  </div>
                }
                style={{ marginLeft: "10px" }}
              />
              <div style={{ textAlign: "right" }}>
                <Text
                  style={{
                    fontSize: "15px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {(
                    (item.product.price -
                      item.product.price * (item.product.discount / 100)) *
                    item.quantity
                  ).toLocaleString()}
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "black",
                      textDecorationLine: "underline",
                    }}
                  >
                    đ
                  </Text>
                </Text>
              </div>
            </List.Item>
          );
        }}
      />
      <div className="flex-space-between">
        <p className="text">TỔNG TIỀN:</p>
        <p style={{ color: "red", fontWeight: "600", fontSize: 16 }}>
          {total.toLocaleString()}0đ
        </p>
      </div>
      <div className="flex-space-between cart-pop-navigate">
        <button
          className="login-pop-btn"
          onClick={() => navigate(CART_URL.INDEX)}
        >
          <span>XEM GIỎ HÀNG</span>
        </button>
        <button
          className="login-pop-btn"
          onClick={() =>
            navigate(PAYMENT_URL.INDEX, { state: { voucherTotal: total } })
          }
        >
          <span>THANH TOÁN</span>
        </button>
      </div>
    </div>
  );

  const items = [
    {
      label: <Link to="/customer">HOME</Link>,
      key: "HOME",
    },
    {
      label: <Link to="/customer/tshirt">T-SHIRT</Link>,
      key: "T-SHIRT",
    },
    {
      label: <Link to="/customer/pant">PANTS</Link>,
      key: "PANTS",
    },
    {
      label: <Link to="/customer/shoes">SHOES</Link>,
      key: "SHOES",
    },
    {
      label: <Link to="/customer/accessory">ACCESSORIES</Link>,
      key: "ACCESSORIES",
    },

    {
      label: <Link to="/customer/about">ABOUT</Link>,
      key: "ABOUT",
    },
    {
      label: <Link to="/customer/exchange-policy">EXCHANGE POLICY</Link>,
      key: "EXCHANGE POLICY",
    },
    {
      label: <Link to="/customer/contact">CONTACT</Link>,
      key: "CONTACT",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="header">
      <Row className="top-bar">
        <p className="container">
          Miễn phí vận chuyển với đơn hàng trên 500K. Hàng pre-order còn được
          giảm thêm 5%.
        </p>
      </Row>
      <Row className="container header-middle flex-center">
        <Col span={4}>
          <img src={Logo2} alt="logo" className="logo" />
        </Col>
        <Col span={9} style={{ position: "relative" }}>
          <div className="flex-center">
            <input
              onFocus={() => {
                setSearchForcus(true);
              }}
              onBlur={() => {
                setTimeout(() => setSearchForcus(false), 100);
              }}
              onChange={(e) => {
                let text = e.target.value;
                if (!text) setSearchList([]);
                if (text.startsWith(" ")) {
                  text = text.trimStart();
                } else {
                  if (text) {
                    getSearchList(text, setSearchList);
                  }
                }
              }}
              pattern="^[^\s].*"
              name="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="search-input"
              autocomplete="off"
            />
            <div className="search-btn">
              <SearchOutlined />
            </div>
          </div>
          {searchFocus ? (
            <div className="search-item">
              {searchList?.tshirts && searchList?.tshirts?.length !== 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={searchList?.tshirts}
                  renderItem={(item, index) => (
                    <List.Item style={{ cursor: "pointer" }}>
                      <List.Item.Meta
                        onClick={() => {
                          console.log("ao");
                          navigate(`/customer/tshirt/${item.tshirtId}`);
                        }}
                        avatar={
                          <img
                            src={"http://localhost:3000" + item.tshirtImg}
                            alt=""
                          />
                        }
                        title={<p>{item.tshirtName}</p>}
                        description={
                          item.tshirtDiscountPercent ? (
                            <p>
                              {(
                                item.tshirtPrice -
                                (item.tshirtPrice *
                                  item.tshirtDiscountPercent) /
                                  100
                              ).toLocaleString("vi-VN")}
                              ₫
                              <del>
                                {item.tshirtPrice.toLocaleString("vi-VN")}₫
                              </del>
                            </p>
                          ) : (
                            <p>{item.tshirtPrice.toLocaleString("vi-VN")}₫</p>
                          )
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div></div>
              )}
              {searchList?.pants && searchList?.pants?.length !== 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={searchList?.pants}
                  renderItem={(item, index) => (
                    <List.Item style={{ cursor: "pointer" }}>
                      <List.Item.Meta
                        onClick={() => {
                          console.log("ao");
                          navigate(`/customer/pant/${item.pantId}`);
                        }}
                        avatar={
                          <img
                            src={"http://localhost:3000" + item.pantImg}
                            alt=""
                          />
                        }
                        title={<p>{item.pantName}</p>}
                        description={
                          item.pantDiscountPercent ? (
                            <p>
                              {(
                                item.pantPrice -
                                (item.pantPrice * item.pantDiscountPercent) /
                                  100
                              ).toLocaleString("vi-VN")}
                              ₫
                              <del>
                                {item.pantPrice.toLocaleString("vi-VN")}₫
                              </del>
                            </p>
                          ) : (
                            <p>{item.pantPrice.toLocaleString("vi-VN")}₫</p>
                          )
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                ""
              )}
              {searchList?.shoesList && searchList?.shoesList?.length !== 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={searchList?.shoesList}
                  renderItem={(item, index) => (
                    <List.Item style={{ cursor: "pointer" }}>
                      <List.Item.Meta
                        onClick={() => {
                          navigate(`/customer/shoes/${item.shoesId}`);
                        }}
                        avatar={
                          <img
                            src={"http://localhost:3000" + item.shoesImg}
                            alt=""
                          />
                        }
                        title={<p>{item.shoesName}</p>}
                        description={
                          item.shoesDiscountPercent ? (
                            <p>
                              {(
                                item.shoesPrice -
                                (item.shoesPrice * item.shoesDiscountPercent) /
                                  100
                              ).toLocaleString("vi-VN")}
                              ₫
                              <del>
                                {item.shoesPrice.toLocaleString("vi-VN")}₫
                              </del>
                            </p>
                          ) : (
                            <p>{item.shoesPrice.toLocaleString("vi-VN")}₫</p>
                          )
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                ""
              )}
              {searchList?.accessories &&
              searchList?.accessories?.length !== 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={searchList?.accessories}
                  renderItem={(item, index) => (
                    <List.Item style={{ cursor: "pointer" }}>
                      <List.Item.Meta
                        onClick={() => {
                          navigate(`/customer/accessory/${item.accessoryId}`);
                        }}
                        avatar={
                          <img
                            src={"http://localhost:3000" + item.accessoryImg}
                            alt=""
                          />
                        }
                        title={<p>{item.accessoryName}</p>}
                        description={
                          item.accessoryDiscountPercent ? (
                            <p>
                              {(
                                item.accessoryPrice -
                                (item.accessoryPrice *
                                  item.accessoryDiscountPercent) /
                                  100
                              ).toLocaleString("vi-VN")}
                              ₫
                              <del>
                                {item.accessoryPrice.toLocaleString("vi-VN")}₫
                              </del>
                            </p>
                          ) : (
                            <p>
                              {item.accessoryPrice.toLocaleString("vi-VN")}₫
                            </p>
                          )
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </Col>
        <Col span={8} className="login-cart flex-center">
          {isAuthenticated ? (
            <Popover
              content={LoginPopover}
              trigger="click"
              className="login-box flex-center "
            >
              <div className="user-icon">
                <UserOutlined className="icon" />
              </div>
              <div className="login">
                <p style={{ color: "#333333" }}>Tài khoản của</p>
                <p style={{ fontWeight: 500 }}>
                  {username} <DownOutlined />
                </p>
              </div>
            </Popover>
          ) : (
            <Popover
              content={LoginPopover}
              trigger="click"
              className="login-box flex-center "
            >
              <div className="user-icon">
                <UserOutlined className="icon" />
              </div>
              <div className="login">
                <p style={{ color: "#333333" }}>Đăng nhập / Đăng ký</p>
                <p style={{ fontWeight: 500 }}>
                  Tài khoản của tôi <DownOutlined />
                </p>
              </div>
            </Popover>
          )}
          <Popover
            placement="bottomRight"
            content={cartPopover}
            trigger="click"
            className="cart flex-center"
          >
            <Badge
              count={carts.length}
              showZero
              style={{ backgroundColor: "#333333" }}
            >
              <ShoppingOutlined className="icon" />
            </Badge>
            <p style={{ marginLeft: 10 }}>Giỏ hàng</p>
          </Popover>
        </Col>
      </Row>
      <Row className="container header-menu">
        <Menu mode="horizontal" items={items} />
      </Row>
    </div>
  );
};

export default Header;
