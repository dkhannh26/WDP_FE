import { Card, Col, Row, Select, Rate, message } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FilterOutlined, HeartFilled } from "@ant-design/icons";
import { getProductList } from "../../services/product/product.service";
import NoImage from '../../assets/images/no-image.jpg';
import { checkWishlist, createWishlist, getListWishlist } from "../../services/wishlist.service";
import axios from "axios";
import { useAuth } from "../../components/context/AuthContext";
import { API_PATH, PATH } from "../../config/api.config";
import { showDeleteConfirm } from "../../utils/helper";
import { useTranslation } from "react-i18next";
const ProductCustomer = () => {
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage()

  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const [likedProducts, setLikedProducts] = useState({});
  const [wishlist, setWishlist] = useState([]);

  const { t, i18n } = useTranslation();


  useEffect(() => {
    let filterCategory

    if (category) {
      filterCategory = category
    } else {
      filterCategory = state?.typeLink
    }

    getProductList(setProducts, filterCategory, brand)
  }, [state, brand, category]);

  const {
    isAuthenticated,
    user,
  } = useAuth();

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
        try {
          const res = await axios.get(`${PATH.profile}/${user.username}`);
          setInitialValues({
            userId: res.data.user._id,
            username: res?.data?.user?.username,
            email: res?.data?.user?.email,
            phone: res?.data?.user?.phone,
            address: res?.data?.user?.address,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleFilterChange = (value) => {
    if (value === "increase") {
      const sortedAscending = sortProductsByPrice(products, 'asc');
      setProducts(sortedAscending);
    } else {
      const sortedDescending = sortProductsByPrice(products, 'desc');
      setProducts(sortedDescending);
    }
  };

  useEffect(() => {
    if (initialValues.userId && products.length > 0) {
      products.forEach(item => checkProductLikedStatus(item.productId));
    }
  }, [initialValues.userId, products]);

  const checkProductLikedStatus = async (productId) => {
    try {
      const response = await checkWishlist(initialValues.userId, productId);
      setLikedProducts(prev => ({
        ...prev,
        [productId]: response.data.isLiked || false,
      }));
    } catch (error) {
      console.error('Error checking liked status:', error);
      setLikedProducts(prev => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  const handleClick = async (productId) => {
    const isLiked = likedProducts[productId] || false;
    try {
      if (isLiked) {
        const wishlistItem = wishlist.find(item => item.product_id === productId);
        const wishlistId = wishlistItem?._id;
        console.log('wishlishId', wishlist);
        await axios.delete(API_PATH.wishlist + `/${wishlistId}`)
        setLikedProducts(prev => ({
          ...prev,
          [productId]: false,
        }));
        console.log('Removed from wishlist');
      } else {
        const wishlist = {
          account_id: initialValues.userId,
          product_id: productId,
        };
        await createWishlist(wishlist);
        setLikedProducts(prev => ({
          ...prev,
          [productId]: true,
        }));
        console.log('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
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
    <Row className="container">
      <Col span={24}>
        {/* <Title level={2} style={{ marginTop: "20px" }}>
          {state?.typeLink === "tshirt" && "T-shirt"}
          {state?.typeLink === "pant" && "Pant"}
          {state?.typeLink === "shoes" && "Shoes"}
          {state?.typeLink === "accessory" && "Accessory"}
        </Title> */}
        <Row style={{ margin: "20px", marginLeft: 0 }}>
          <div className="product-filter">
            <FilterOutlined /> {t('filter')}
            <Select
              defaultValue={t('price')}
              style={{
                marginLeft: 20,
                width: 110,
              }}
              onChange={handleFilterChange}
              options={[
                {
                  value: 'increase',
                  label: t('increase'),
                },
                {
                  value: 'decrease',
                  label: t('decrease'),
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
                  style={{ width: "95%", marginLeft: "5%", marginBottom: '10px' }}
                  cover={
                    <img
                      alt="example"
                      style={{ width: "100%", height: '350px' }}
                      src={item.productImg ? `http://localhost:3000${item.productImg}` : NoImage}
                    />
                  }
                >
                  <Meta
                    title={item.productName}
                    description={
                      <>
                        <p>
                          {t('home.origin_price')}: {item.productPrice.toLocaleString("vi-VN")}₫
                        </p>
                        {item.productDiscountPercent ? (
                          <p>
                            {t('home.promotional_price')}:{" "}
                            {(
                              item.productPrice -
                              (item.productPrice * item.productDiscountPercent) /
                              100
                            ).toLocaleString("vi-VN")}
                            ₫ (-{item.productDiscountPercent}%)
                          </p>
                        ) : (
                          <p>{t('home.no_promotions')}</p>
                        )}
                      </>
                    }
                  />
                </Card>
                <Rate
                  count={1}
                  character={<HeartFilled />}
                  className="heart-filled"
                  value={likedProducts[item.productId] ? 1 : 0}
                  onClick={() => handleClick(item.productId)}
                />
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
};

export default ProductCustomer;
