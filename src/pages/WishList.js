import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Image, InputNumber, Modal, Row, Space, Table, Tag, message, Typography } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getListWishlist } from '../services/wishlist.service';
import { useAuth } from '../components/context/AuthContext';
import axios from 'axios';
import { API_PATH, PATH } from '../config/api.config';
import { showDeleteConfirm } from '../utils/helper';
import Title from 'antd/es/typography/Title';
import { getProductDetailCustomer } from '../services/product/product.service';
import { AddCartDup, AddCartDupWishlist, createCart, createCartWishlist, getListCart } from '../services/cart.service';
import { useRefresh } from '../context/RefreshContext';
const { Text } = Typography;
const { Column, ColumnGroup } = Table;


const WishList = () => {
    const [wishlist, setWishlist] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [product, setProduct] = useState();
    const [cart, setCarts] = useState([]);
    const [total, setTotal] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [sizeSelected, setSizeSelected] = useState('')
    const [refresh, setRefresh] = useState(false);
    const [sizeNumber, setSizeNumber] = useState(1)
    const [detailId, setProductDetailId] = useState('')
    const { id } = useParams();
    const [images, setImages] = useState();
    const [canvas, setCanvas] = useState('https://top10hoabinh.com/wp-content/uploads/2022/10/anh-dang-load-2.jpg')
    const selectSize = (size, number, detailId) => {
        setSizeSelected(size);
        setSizeNumber(number);
        setProductDetailId(detailId);
        setCount(1);
    };
    const [count, setCount] = useState(1);
    const navigate = useNavigate();
    const { toggleRefresh } = useRefresh();

    const handleIncrement = () => {
        if (count < sizeNumber) setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };
    const showModal = (record) => {
        getProductDetailCustomer(record.record.product_id, setProduct, setImages, setCanvas, selectSize)
        setSelectedProduct(record);
        console.log('Received record:', record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };
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
    useEffect(() => {
        if (initialValues.userId) {
            getListWishlist(initialValues.userId, setWishlist)
        }
    }, [initialValues.userId]);
    const dataSource = wishlist.map((item, index) => ({
        key: item._id || index,
        image: `${API_PATH.image}/${item.product_id}/${item.image}`,
        product_name: item.product_name,
        price: item.price,
        price_discount: ((item.price - (item.price * (item.discount / 100)))).toLocaleString(),
        quantity: item.quantity,
        tags: [item.quantity > 0 ? 'in stock' : 'out of stock'],
        record: item,
    }));
    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <>
                <img style={{ width: 64, float: 'right' }} src={text} alt="demo" />
            </>
        },
        {
            title: 'Product name',
            dataIndex: 'product_name',
            key: 'product_name',
            render: (text) => <>{text}</>,
        },
        {
            title: 'Unit price',
            dataIndex: 'price',
            key: 'price',
            render: (price, record) => (
                <div>
                    <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '10px' }}>
                        {price.toLocaleString()}đ
                    </span>
                    {record.price_discount && (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                            {record.price_discount}đ
                        </span>
                    )}
                </div>
            ),
        },
        {
            title: 'Stock status',
            dataIndex: 'tags',
            key: 'status',
            render: (tags) => (
                <>
                    {tags.map((tag) => {
                        let color = tag === 'in stock' ? 'green' : 'volcano';
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button danger shape="round" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record.record._id, messageApi, () => getListWishlist(initialValues.userId, setWishlist), setWishlist, API_PATH.wishlist)} ></Button>
                        <Button
                            type="text"
                            disabled={record.quantity <= 0}
                            icon={
                                <ShoppingCartOutlined
                                    style={{
                                        fontSize: '22px',
                                    }}
                                />
                            }
                            onClick={() => showModal(record)}
                        />
                    </Space>
                )
            },
        },
    ];


    const handleAddToCart = async (e) => {
        try {
            if (initialValues.userId) {
                await getListCart(initialValues.userId, setCarts, (total) => {
                    setTotal(total);
                });
            }

            if (!product || !product.size) {
                await getProductDetailCustomer(selectedProduct.record.product_id, setProduct, setImages, setCanvas, selectSize);
            }

            if (product && product.size) {
                const selectedSize = product.size.find(item => item.product_size_id === detailId);
                const availableQuantity = selectedSize ? selectedSize.quantity : 0;

                if (availableQuantity <= 0) {
                    alert('sold out');
                    return;
                }

                const matchingCartItem = cart.find(item => item.product_size_id === detailId);
                if (matchingCartItem) {
                    const updatedQuantity = matchingCartItem.cartQuantity + count;
                    if (updatedQuantity > matchingCartItem.quantity || matchingCartItem.quantity < 0) {
                        alert('sold out');
                    } else {
                        await AddCartDupWishlist(matchingCartItem._id, { quantity: updatedQuantity });
                        messageApi.success('Product updated in cart');
                    }
                } else {
                    if (availableQuantity >= count) {
                        const newCart = {
                            account_id: initialValues.userId,
                            product_size_id: detailId,
                            quantity: count,
                        };
                        await createCartWishlist(newCart);
                        messageApi.success('Product added to cart');
                    } else {
                        alert('sold out');
                    }
                }
                toggleRefresh();
            }

            setIsModalVisible(false);
            const button = e.currentTarget;
            const cartIcon = document.querySelector('.anticon-shopping');
            const card = document.querySelector(`[data-row-key="${selectedProduct.key}"]`);
            const imgToDrag = card.querySelector('img');

            if (imgToDrag && cartIcon) {
                const imgClone = imgToDrag.cloneNode(true);
                const imgRect = imgToDrag.getBoundingClientRect();
                const cartRect = cartIcon.getBoundingClientRect();

                Object.assign(imgClone.style, {
                    position: 'absolute',
                    top: `${imgRect.top}px`,
                    left: `${imgRect.left}px`,
                    opacity: '0.8',
                    height: '150px',
                    width: '150px',
                    zIndex: '100',
                    transition: 'all 1s ease-in-out',
                });

                document.body.appendChild(imgClone);

                setTimeout(() => {
                    Object.assign(imgClone.style, {
                        top: `${cartRect.top + 8}px`,
                        left: `${cartRect.left + 7}px`,
                        width: '10px',
                        height: '10px',
                    });

                    imgClone.addEventListener('transitionend', () => {
                        imgClone.remove();
                    });
                }, 0);
            }

            setSelectedProduct(null);
        } catch (error) {
            console.error('Error adding to cart:', error);
            messageApi.error('Failed to add to cart');
        }
    };
    return (
        <div className="container">
            <Table
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                style={{ marginTop: '50px' }}
            />

            <Modal title="Add to cart" visible={isModalVisible} onOk={handleAddToCart} onCancel={handleCancel} okText={'Apply'}>
                {selectedProduct ? (
                    <Row>
                        <Col span={12}>
                            <Image
                                preview={false}
                                style={{ marginBottom: 10 }}
                                width={'80%'}
                                src={selectedProduct.image}
                            />
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Title level={4}>{selectedProduct.product_name}</Title>
                            </Row>
                            <Row style={{
                                alignItems: 'center',
                                width: 60,
                                height: 35,
                                color: 'red',
                                fontSize: 20,
                                fontWeight: 700
                            }}>
                                {(selectedProduct.price).toLocaleString('vi-VN')}₫
                            </Row>
                            <Row
                                style={{
                                    alignItems: 'center',
                                    paddingTop: 20,
                                    paddingBottom: 20,
                                    borderTop: '1px solid #F5F5F5',
                                    borderBottom: '1px solid #F5F5F5'
                                }}>

                                {product?.size.map((item, index) => {
                                    console.log(item)
                                    return (
                                        <Button
                                            key={index}
                                            color="default"
                                            variant={sizeSelected === item?.size_name ? "solid" : ''}
                                            className="size-button"
                                            onClick={() => selectSize(item?.size_name, item?.quantity, item?.product_size_id)}
                                        >
                                            {item?.size_name}
                                        </Button>
                                    );
                                })}
                            </Row>
                            <Row
                                style={{
                                    paddingTop: 20,
                                    paddingBottom: 20,
                                    borderTop: '1px solid #F5F5F5',
                                    borderBottom: '1px solid #F5F5F5'
                                }}
                            >
                                <div>
                                    <Button onClick={handleDecrement} variant='filled' color='default'>-</Button>
                                    <InputNumber min={1} value={count} onChange={setCount} readOnly style={{ width: '45px' }} />
                                    <Button onClick={handleIncrement} variant='filled' color='default' >+</Button>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                ) : (
                    <p>No product selected</p>
                )}
            </Modal>
        </div>
    );
};

export default WishList;
