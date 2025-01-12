import {
    CloseOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Image, InputNumber, List, Row, Space, Typography, message } from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_PATH, PATH } from "../../config/api.config";
import { PAYMENT_URL } from '../../config/url.config';
import { editCart, getListCart } from '../../services/cart.service';
import { getListVoucher } from '../../services/voucher.service';
import { showDeleteConfirm } from '../../utils/helper';
import { useAuth } from '../context/AuthContext';


const { Text } = Typography;

const CartList = () => {
    const [isCheck, setIsCheck] = useState();
    const [carts, setCarts] = useState([])
    const [voucher, setVoucher] = useState([])
    const [messageApi, contextHolder] = message.useMessage(null)
    const navigate = useNavigate()
    const [totalAmount, setTotalAmount] = useState(Number);
    const [total, setTotal] = useState(Number);
    const [initialTotal, setInitialTotal] = useState(0);

    const onChange = (value, id) => {
        const updatedCart = { quantity: value };
        editCart(id, updatedCart, setTotalAmount)
    };

    const handleVoucherClick = (voucherId, percent) => {
        setIsCheck(voucherId);
        setTotal(initialTotal - percent);
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
            getListVoucher(setVoucher);
            getListCart(initialValues.userId, setCarts, (total) => {
                setTotal(total);
                setInitialTotal(total);
            });
            setIsCheck(null);
        }
    }, [totalAmount, initialValues.userId]);

    console.log(carts);
    // let amount = carts?.map(cart => cart.product.price * cart.quantity);
    // console.log('amount', amount)
    // const total = amount.reduce((a, b) => a + b, 0);
    // setTotalAmount(total);

    // console.log(carts);
    // console.log(voucher);


    return (
        <div style={{ padding: '20px' }}>

            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col xs={24} md={16}>
                    <Text strong style={{ fontSize: '16px', backgroundColor: '#f5f5f5', padding: '10px', display: 'block', textAlign: 'left', color: '#888' }}>
                        Có <Text style={{ color: 'blue', fontSize: '16px' }}>{carts.length} sản phẩm</Text>  trong giỏ hàng
                    </Text>
                    <List
                        itemLayout="horizontal"
                        dataSource={carts}
                        renderItem={(item) => {
                            return (<List.Item>
                                <List.Item.Meta
                                    avatar={
                                        item.productImage ? (
                                            <Image width={100} src={`${API_PATH.image}/${item.product.product_id}/${item.productImage._id}${item.productImage.file_extension}`} />
                                            // {`${API_PATH.image}/${item.product.product_id}/${item.productImage._id}${item.productImage.file_extension}`}
                                            // <span>{item.productImage ? item.productImage._id : "default extension"}</span>

                                        ) : (
                                            <Image width={100} src="path-to-default-image" />
                                            // <span>{item.productImage ? item.productImage.file_extension : "default extension"}</span>
                                        )
                                    }
                                    title={
                                        <Text style={{ display: 'block', textAlign: 'left', fontSize: '15px', fontWeight: 'bold' }}>{item.product.name}</Text>
                                    }
                                    description={(
                                        <div style={{ marginTop: '5px', display: 'block', textAlign: 'left' }}>
                                            <Text style={{ color: '#888' }}>{(item.product.price * item.quantity).toLocaleString()}<Text style={{ fontSize: '10px', color: '#888', textDecorationLine: 'underline' }}>đ</Text></Text>
                                            <br />
                                            <Text style={{ color: '#888' }}>Kích thước: {item.productSize ? item.productSize.size_name : "Không có kích thước"}</Text>
                                            <br />
                                            <InputNumber min={1} max={item.product.quantity} defaultValue={Math.min(item.quantity, item.product.quantity)} onChange={(value) => onChange(value, item._id)} />
                                        </div>
                                    )}
                                    style={{ marginLeft: '10px' }}
                                />
                                <div style={{ textAlign: 'right' }}>
                                    <Button type="link" onClick={() => showDeleteConfirm(item._id, messageApi,
                                        () => getListCart(initialValues.userId, setCarts, (total) => {
                                            setTotal(total);
                                            setInitialTotal(total)
                                        }), setCarts, API_PATH.cart)}><CloseOutlined style={{ color: 'black' }} /></Button>
                                    <br />
                                    <br />
                                    <br />
                                    <Text style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }}>{((item.product.price - (item.product.price * (item.product.discount / 100))) * item.quantity).toLocaleString()}<Text style={{ fontSize: '10px', color: 'black', textDecorationLine: 'underline' }}>đ</Text></Text>
                                </div>
                            </List.Item>)
                        }
                        }
                    />
                    {/* <Card bordered={false} style={{ backgroundColor: '#f5f5f5' }}>
                        <Text strong style={{ fontSize: '16px', textAlign: 'left', display: 'block', color: '#888' }}>Ghi chú đơn hàng</Text>
                        <Form.Item style={{ marginTop: '10px' }}>
                            <Input.TextArea rows={4} placeholder="Nhập ghi chú đơn hàng của bạn" style={{ width: '100%', borderColor: '#000000' }} />
                        </Form.Item>
                    </Card> */}
                </Col>

                <Col xs={24} md={8}>
                    <div style={{ position: 'sticky', top: '20px' }}>
                        <Card
                            title={<Title level={4} style={{ textAlign: 'left' }}>Thông tin đơn hàng</Title>}
                            bordered={false}
                            style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                        >
                            <Space wrap style={{ marginBottom: '20px' }}>
                                {voucher.map((item) => {
                                    return (
                                        <Button color={isCheck === item._id ? 'primary' : 'default'} variant='outlined' onClick={() => handleVoucherClick(item._id, item.percent)} disabled={total < item.condition} >Giảm {item.percent}đ cho đơn từ {item.condition}đ</Button>
                                    )
                                })}
                            </Space>



                            <Row justify="space-between" align="middle">
                                <Text style={{ fontWeight: 'bold', color: '#888' }}>Tổng tiền:</Text>
                                <Text style={{ fontSize: '20px', color: 'red', fontWeight: 'bold' }}>
                                    {total.toLocaleString()}<Text style={{ fontSize: '15px', color: 'red', textDecorationLine: 'underline' }}>đ</Text>
                                </Text>
                            </Row>
                            {carts.length !== 0 ? <Button type="primary" block style={{ marginTop: '20px', backgroundColor: 'red', borderColor: 'red' }} onClick={() => navigate(PAYMENT_URL.INDEX, { state: { voucherTotal: total } })}>
                                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: '14px' }}>THANH TOÁN</Text>
                            </Button> : ''}

                        </Card>

                    </div>
                </Col>
            </Row>
        </div >
    );
}

export default CartList;
