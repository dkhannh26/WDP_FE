// export default Header;
import React, { useEffect } from "react";
import { Switch } from 'antd';
import styled from 'styled-components';
import engFlag from '../../assets/images/eng.png'
import VietFlag from '../../assets/images/VietFlag.svg.webp'

import {
  DownOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Col,
  Image,
  List,
  Menu,
  Popover,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/header.css";
import { getSearchList } from "../../services/product/search.service";
import LoginPopover from "../login";
import { CART_URL, PAYMENT_URL, WISHLIST_URL } from "../../config/url.config";
import { API_PATH, PATH } from "../../config/api.config";
import { getListCart } from "../../services/cart.service";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from '../../context/RefreshContext';
import Logo2 from "../../assets/images/logo2.jpeg";
import { getListBrand } from "../../services/brand.service";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const Header = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (checked) => {
    const newLanguage = checked ? 'vi' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const language = i18n.language;

  const [searchFocus, setSearchForcus] = useState(false);
  const [searchList, setSearchList] = useState([]);

  const [carts, setCarts] = useState([]);
  // const [messageApi, contextHolder] = message.useMessage(null)
  const [totalAmount, setTotalAmount] = useState(Number);
  const [total, setTotal] = useState(Number);
  const [brands, setBrands] = useState([]);
  const { refresh } = useRefresh();

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
    getListBrand(setBrands);
  }, [])

  useEffect(() => {
    if (initialValues.userId) {
      getListCart(initialValues.userId, setCarts, (total) => {
        setTotal(total);
      });
    }
  }, [totalAmount, initialValues.userId, refresh]);

  const CustomSwitch = styled(Switch)`
  &.ant-switch {
    background-color:#092C70;
    &:hover {
      background-color: #092C70; 
    }
  }
  &.ant-switch-checked {
    background-color:rgb(205, 49, 25); 
    &:hover {
      background-color: rgb(205, 49, 25) !important;
    }
  }
  .ant-switch-handle {  
    width: 18px;
    height: 18px; 
    top: 50%; 
    transform: translateY(-52%); 
    left: 2px; 
  }
  .ant-switch-handle::before {
    background-color: #fff;
    top: '50%';
    left: '50%';
    ${'' /* transform: 'translate(-50%, -50%)'; */}
  }
`;
  const cartPopover = (
    <div className="cart-pop">
      <div className="card-pop-title text uppercase">
        <p>{t('header.cart')}</p>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={carts}
        renderItem={(item) => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={
                  item.image ? (
                    <Image
                      width={100}
                      src={`${API_PATH.image}/${item.product_id}/${item.image}`}
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
                    {item.product_name}
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
                      {(item.price * item.cartQuantity).toLocaleString()}
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
                      {t('header.size')}:{" "}
                      {item.product_size_name
                        ? item.product_size_name
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
                    (item.price -
                      item.price * (item?.discount / 100)) *
                    item.cartQuantity
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
        <p className="text uppercase">{t('header.total')}:</p>
        <p style={{ color: "red", fontWeight: "600", fontSize: 16 }}>
          {total.toLocaleString()}0đ
        </p>
      </div>
      <div className="flex-space-between cart-pop-navigate">
        <button
          className="login-pop-btn uppercase"
          onClick={() => navigate(CART_URL.INDEX)}
        >
          <span>{t('header.view_cart')}</span>
        </button>
        <button
          className="login-pop-btn uppercase"
          onClick={() =>
            navigate(PAYMENT_URL.INDEX, { state: { voucherTotal: total } })
          }
        >
          <span>{t('header.payment')}</span>
        </button>
      </div>
    </div>
  );


  // const content = (
  //   <div>
  //     <Table
  //       columns={[
  //         { title: 'VỢT CẦU LÔNG', dataIndex: 'racket', key: 'racket' },
  //         { title: 'GIÀY CẦU LÔNG', dataIndex: 'shoes', key: 'shoes' },
  //         { title: 'ÁO CẦU LÔNG', dataIndex: 'shirt', key: 'shirt' },
  //         { title: 'VỚ CẦU LÔNG', dataIndex: 'socks', key: 'socks' },
  //         { title: 'QUẦN CẦU LÔNG', dataIndex: 'pants', key: 'pants' },
  //         { title: 'TÚI VỢT CẦU LÔNG', dataIndex: 'bag', key: 'bag' },
  //       ]}
  //       dataSource={[
  //         { key: '1', racket: <Link to="/customer/product">Vợt Yonex</Link>, shoes: 'Giày cầu lông Yonex', shirt: 'Áo cầu lông Yonex', socks: 'Vớ cầu lông Yonex', pants: 'Quần cầu lông Yonex', bag: 'Túi YONEX' },
  //         { key: '2', racket: 'Vợt cầu lông Victor', shoes: 'Giày cầu lông Victor', shirt: 'Áo cầu lông VNB', socks: 'Vớ cầu lông Victor', pants: 'Quần cầu lông Victor' },
  //         // Thêm các dòng khác tương tự
  //       ]}
  //       pagination={false}
  //     />
  //   </div>
  // );
  const categories = [
    { title: t('racket'), path: '/customer/racket', typeLink: 'racket', query: 'Racket' },
    { title: t('shoes'), path: '/customer/shoes', typeLink: 'shoes', query: 'Shoes' },
    { title: t('shirt'), path: '/customer/tshirt', typeLink: 'tshirt', query: 'tshirt' },
    { title: t('pants'), path: '/customer/pant', typeLink: 'pant', query: 'pants' },
    { title: t('accessories'), path: '/customer/accessory', typeLink: 'accessory', query: 'Accessories' },
  ];
  const content = (
    <div style={{ width: '100vw' }}>
      <div className="product-menu">
        {categories.map(category => (
          <div className="product-menu-item" key={category.title}>
            <h4 className="product-menu-item--title">
              <Link to={category.path} state={{ typeLink: category.typeLink }}>
                {category.title}
              </Link>
            </h4>
            <ul className="product-menu-item--list">
              {brands.map(brand => (
                <li key={`${category.query.toLowerCase()}-${brand._id}`}>
                  <Link to={`/customer/product?category=${category.query}&brand=${brand.name}`}>
                    {language === "vi"
                      ? `${category.title} ${brand.name}`
                      : `${brand.name} ${category.title}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
  const items = [
    {
      label: <Link to="/customer">{t('header.home')}</Link>,
      key: "HOME",
    },
    {
      // label: (<Link to="/customer/product">PRODUCT <DownOutlined /></Link>),
      label: <Popover content={content} >
        {t('header.product')}
      </Popover>,
      key: "PRODUCT",
    },
    {
      label: <Link to="/customer/about">{t('header.about')}</Link>,
      key: "ABOUT",
    },
    {
      label: <Link to="/customer/exchange-policy">{t('header.exchange_policy')}</Link>,
      key: "EXCHANGE POLICY",
    },
    {
      label: <Link to="/customer/contact">{t('header.contact')}</Link>,
      key: "CONTACT",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="header">
      {/* <Row className="top-bar">
        <p className="container">
          Miễn phí vận chuyển với đơn hàng trên 500K. Hàng pre-order còn được
          giảm thêm 5%.
        </p>
      </Row> */}
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
              placeholder={t('search.product')}
              className="search-input"
              autocomplete="off"
            />
            <div className="search-btn">
              <SearchOutlined />
            </div>
          </div>
          {searchFocus ? (
            <div className="search-item">
              {searchList?.products &&
                searchList?.products?.length !== 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={searchList?.products}
                  renderItem={(item, index) => (
                    <List.Item style={{ cursor: "pointer" }}>
                      <List.Item.Meta
                        onClick={() => {
                          navigate(`/customer/product/${item.productId}`);
                        }}
                        avatar={
                          <img
                            src={"http://localhost:3000" + item.productImg}
                            alt=""
                          />
                        }
                        title={<p>{item.productName}</p>}
                        description={
                          item.productDiscountPercent ? (
                            <p>
                              {(
                                item.productPrice -
                                (item.productPrice *
                                  item.productDiscountPercent) /
                                100
                              ).toLocaleString("vi-VN")}
                              ₫
                              <del>
                                {item.productPrice.toLocaleString("vi-VN")}₫
                              </del>
                            </p>
                          ) : (
                            <p>
                              {item.productPrice.toLocaleString("vi-VN")}₫
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
                <p style={{ color: "#333333" }}> {t('header.account_of')}</p>
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
                <p style={{ color: "#333333" }}> {t('header.sign_in')} /  {t('header.sign_up')}</p>
                <p style={{ fontWeight: 500 }}>
                  {t('header.my_account')}<DownOutlined />
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
            <p style={{ marginLeft: 10 }}> {t('header.cart')}</p>
          </Popover>
          <span
            style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
            onClick={() => navigate(WISHLIST_URL.INDEX)}
          >
            <HeartOutlined style={{ fontSize: "24px" }} />
            <span>{t('header.wishlist')}</span>
          </span>
        </Col>
        <Col span={2} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
          <CustomSwitch
            defaultChecked={i18n.language === 'vi'}
            onChange={handleLanguageChange}
            style={{ height: 26 }}
            padding='10px 0'
            checkedChildren={
              <Image
                position='absolute'
                width={30}

                src={VietFlag}
              />}
            unCheckedChildren={
              <Image
                position='absolute'
                width={30}
                src={engFlag}
              />}
          />
        </Col>
      </Row>
      <Row className="container header-menu">
        <Menu mode="horizontal" items={items} />
      </Row>
    </div>
  );
};

export default Header;
