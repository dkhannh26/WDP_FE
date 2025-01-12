import { MoneyCollectTwoTone } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Image, Input, List, Row, Typography, message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { deleteCart, getListCart } from '../../services/cart.service';
import LocationSelector from './LocationSelector';
import { useLocation, useNavigate } from 'react-router';
import { createOrder } from '../../services/order.service';
import { createPayment } from '../../services/payment.service';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_PATH, PATH } from '../../config/api.config';
import { layout } from '../../config/style.config';

const { Text } = Typography;


const PaymentModel = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    // const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
    const [carts, setCarts] = useState([])
    const [voucherTotal, setVoucherTotal] = useState(0);
    const [total, setTotal] = useState(Number);
    const [name, setName] = useState('Nguyen Thanh Son');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('sonntce171760@fpt.edu.vn');
    const [address, setAddress] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [language, setLanguage] = useState('vn');
    const [isCOD, setIsCOD] = useState(false);
    const [isVNPay, setIsVNPay] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    // const fetchShippingMethods = (city, district, ward) => {
    //     if (city && district && ward) {
    //         setShippingMethods([
    //             'Standard Shipping (5-7 days)',
    //             'Express Shipping (2-3 days)',
    //             'Same-day Delivery',
    //         ]);
    //     }
    // };

    const handleLocationSelect = (city, district, ward) => {
        if (city) {
            setSelectedCity(city);
        }
        if (district) {
            setSelectedDistrict(district);
        }
        if (ward) {
            setSelectedWard(ward);
        }
        // fetchShippingMethods(city, district, ward);
    };

    // const handleShippingMethodSelect = (method) => {
    //     setSelectedShippingMethod(method);
    //     if (method === 'Standard Shipping (5-7 days)') {
    //         setTotalAmount(500000); // 500,000 VND
    //     } else if (method === 'Express Shipping (2-3 days)') {
    //         setTotalAmount(600000); // 600,000 VND
    //     } else if (method === 'Same-day Delivery') {
    //         setTotalAmount(700000); // 700,000 VND
    //     }
    // };
    const handleCODChange = (e) => {
        setIsCOD(e.target.checked);
        if (e.target.checked) {
            setPaymentMethod('COD');
        } else {
            setPaymentMethod(null);
        }

    };

    const handleVNPayChange = (e) => {
        setIsVNPay(e.target.checked);
        if (e.target.checked) {
            setPaymentMethod('VNPay');
        } else {
            setPaymentMethod(null);
        }
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
    const onFinish = () => {
        if (!isCOD && !isVNPay) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }
        if (!selectedCity || !selectedDistrict || !selectedWard) {
            message.error('Vui lòng chọn đầy đủ thông tin địa chỉ!');
            return;
        }
        console.log(selectedCity + ' ' + selectedDistrict + ' ' + selectedWard);
        const values = {
            name,
            phone,
            email,
            address,
            voucherTotal,
            cartItems: carts.map(cart => ({ id: cart._id, quantity: cart.quantity, accessory_id: cart.accessory_id, shoes_size_detail_id: cart.shoes_size_detail_id, pant_shirt_size_detail_id: cart.pant_shirt_size_detail_id }))
        };
        const order = {
            account_id: initialValues.userId,
            phone: values.phone,
            address: selectedCity + ' ' + selectedDistrict + ' ' + selectedWard + ' ' + values.address,
            total_price: values.voucherTotal,
            orderItems: values.cartItems.map(item => ({
                accessory_id: item.accessory_id,
                quantity: item.quantity,
                shoes_size_detail_id: item.shoes_size_detail_id,
                pant_shirt_size_detail_id: item.pant_shirt_size_detail_id,
            })),
        };
        if (isCOD) {
            deleteCart(initialValues.userId);
            createOrder(order, navigate);
        } else if (isVNPay) {
            createPayment(voucherTotal, bankCode, language, name, selectedCity + ' ' + selectedDistrict + ' ' + selectedWard + ' ' + address, phone);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            if (initialValues.userId) {
                await getListCart(initialValues.userId, setCarts, (total) => {
                    setTotal(total);
                    setIsLoading(false);
                });
            }
            if (location.state && location.state.voucherTotal) {
                setVoucherTotal(location.state.voucherTotal);
            }
        };

        fetchData();
    }, [initialValues]);


    useEffect(() => {
        if (isLoading) return;
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        const voucherTotal = params.get('voucherTotal');
        const name = params.get('name');
        const address = params.get('address');
        const phone = params.get('phone');
        console.log(selectedCity + ' ' + selectedDistrict + ' ' + selectedWard);
        if (type === 'OK') {
            const values = {
                name,
                phone,
                email,
                address,
                voucherTotal,
                cartItems: carts.map(cart => ({ id: cart._id, quantity: cart.quantity, accessory_id: cart.accessory_id, shoes_size_detail_id: cart.shoes_size_detail_id, pant_shirt_size_detail_id: cart.pant_shirt_size_detail_id }))
            };
            const order = {
                account_id: initialValues.userId,
                phone: values.phone,
                address: values.address,
                total_price: values.voucherTotal / 100,
                orderItems: values.cartItems.map(item => ({
                    accessory_id: item.accessory_id,
                    quantity: item.quantity,
                    shoes_size_detail_id: item.shoes_size_detail_id,
                    pant_shirt_size_detail_id: item.pant_shirt_size_detail_id,
                })),
            };
            deleteCart(initialValues.userId);
            createOrder(order, navigate);
        }
    }, [isLoading, carts]);
    console.log(selectedCity + ' ' + selectedDistrict + ' ' + selectedWard);
    if (isLoading) return <div>Loading...</div>;
    const validateMessages = {
        required: '${label} is required!',
    };
    return (
        <div style={{ padding: '10px' }}>
            <Row gutter={16} style={{ marginTop: '3%' }}>
                <Col xs={24} md={14} style={{ textAlign: 'left', paddingLeft: '5%', paddingRight: '5%' }}>
                    <Title level={3}>Thông tin giao hàng</Title>
                    <Form
                        name="nest-messages"
                        onFinish={onFinish}

                        validateMessages={validateMessages}
                    >
                        <Form.Item
                            name={['user', 'name']}
                            initialValue={initialValues.username}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Họ và Tên"
                                disabled
                                defaultValue={initialValues.username}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Item>
                        <Row style={{ marginTop: '3%', display: 'flex', justifyContent: 'space-between' }}>
                            <Col xs={15}>
                                <Input
                                    size="large"
                                    placeholder="Email"
                                    defaultValue={initialValues.email}
                                    disabled
                                />
                            </Col>
                            <Col xs={8}>
                                <Form.Item
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter your phone number.',
                                        },
                                        {
                                            pattern: /^[0-9]{10}$/,
                                            message: 'Phone number must be exactly 10 digits.',
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="Số điện thoại"
                                        onChange={(e) => setPhone(e.target.value)}

                                    />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Form.Item
                            name={'address'}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Địa chỉ"
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </Form.Item>
                        <LocationSelector onSelect={handleLocationSelect} />

                        {/* {selectedCity && selectedDistrict && selectedWard && (
                        <Card title="Phương thức vận chuyển" bordered style={{ marginTop: '20px' }}>
                            {shippingMethods.map((method, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <Text
                                        strong
                                        onClick={() => handleShippingMethodSelect(method)}
                                        style={{ cursor: 'pointer', color: selectedShippingMethod === method ? 'blue' : 'black' }}
                                    >
                                        {method}
                                    </Text>
                                </div>
                            ))}
                        </Card>
                    )} */}
                        <Title level={4}>Phương thức thanh toán</Title>
                        <Card style={{ padding: '16px' }}>
                            <Checkbox
                                checked={paymentMethod === 'COD'}
                                onChange={handleCODChange}
                                style={{ fontSize: '18px', lineHeight: '24px' }}
                            >
                                <Title level={5} style={{ margin: 0, fontSize: '18px', color: '#888' }}>
                                    <MoneyCollectTwoTone /> Thanh toán khi nhận hàng (COD)
                                </Title>
                            </Checkbox>
                            <Checkbox
                                checked={paymentMethod === 'VNPay'}
                                onChange={handleVNPayChange}
                                style={{ fontSize: '18px', lineHeight: '24px', marginTop: '3%' }}
                            >
                                <Title level={5} style={{ margin: 0, fontSize: '18px', color: '#888', display: 'flex', alignItems: 'center' }}>
                                    <Image
                                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8H-_-qAYkAhj5xnn22LxEr_uRDrxY7FuhMg&s'
                                        alt='VNPay'
                                        style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                    />
                                    Thanh toán bằng ví VNPay
                                </Title>
                            </Checkbox>
                        </Card>
                        <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: '3%' }}>
                            <Col>
                                <a onClick={() => navigate(-1)}>Giỏ hàng</a>
                            </Col>
                            <Col>
                                <Button type='primary' htmlType="submit">Hoàn tất đơn hàng</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>

                <Col xs={24} md={10} style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                    <Title level={3}>Thông tin thanh toán</Title>

                    <List
                        itemLayout="horizontal"
                        dataSource={carts}
                        renderItem={(item) => (

                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        item.productImage ? (
                                            <Image width={100} src={`${API_PATH.image}/${item.product.product_id}/${item.productImage._id}${item.productImage.file_extension}`} />
                                        ) : (
                                            <Image width={100} src="path-to-default-image" />
                                        )
                                    }
                                    title={
                                        <Text style={{ display: 'block', textAlign: 'left', fontSize: '15px', fontWeight: 'bold' }}>{item.product.name}</Text>
                                    }
                                    description={(
                                        <div style={{ marginTop: '5px', display: 'block', textAlign: 'left' }}>
                                            <Text style={{ color: '#888' }}>Kích thước: {item.productSize ? item.productSize.size_name : "Không có kích thước"}</Text>
                                        </div>
                                    )}
                                    style={{ marginLeft: '10px' }}
                                />
                                <div style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }}>{((item.product.price - (item.product.price * (item.product.discount / 100))) * item.quantity).toLocaleString()}<Text style={{ fontSize: '10px', color: 'black', textDecorationLine: 'underline' }}>đ</Text></Text>
                                </div>
                            </List.Item>
                        )}
                    />
                    <Card bordered={false} style={{ backgroundColor: '#f5f5f5' }}>
                        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Col>
                                <Text strong style={{ fontSize: '16px', textAlign: 'left', display: 'block', color: '#888' }}>Tạm Tính</Text>
                            </Col>
                            <Col style={{ fontWeight: 'bold' }}>
                                {total.toLocaleString()}<Text style={{ fontSize: '15px', textDecorationLine: 'underline' }}>đ</Text>
                            </Col>
                        </Row>
                        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Col>
                                <Text strong style={{ fontSize: '16px', textAlign: 'left', display: 'block', color: '#888' }}>Voucher giảm</Text>
                            </Col>
                            <Col style={{ fontWeight: 'bold' }}>
                                {(total - voucherTotal).toLocaleString()}<Text style={{ fontSize: '15px', textDecorationLine: 'underline' }}>đ</Text>
                            </Col>
                        </Row>
                    </Card>
                    <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Col>
                            <Title level={4}>Tổng cộng</Title>
                        </Col>
                        <Col>
                            <Title level={3}><span style={{ color: 'red' }}>{voucherTotal.toLocaleString()}</span><Text style={{ fontSize: '20px', color: 'red', textDecorationLine: 'underline' }}>đ</Text></Title>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default PaymentModel;
