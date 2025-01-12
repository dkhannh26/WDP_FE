import { Button, Col, Image, InputNumber, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import '../../../assets/css/sizeBtn.css'
import { getShoesCustomer } from '../../../services/product/shoes.service';
import { useAuth } from '../../../components/context/AuthContext';
import axios from 'axios';
import { PATH } from '../../../config/api.config';
import { AddCartDup, createCart, getListCart, getProductDetail } from '../../../services/cart.service';
import CustomerFeedback from '../../../components/feedback/CustomerFeedback';
const { Text } = Typography;
const ShoesDetail = () => {
    const [canvas, setCanvas] = useState('https://top10hoabinh.com/wp-content/uploads/2022/10/anh-dang-load-2.jpg')
    const { id } = useParams();
    const [cart, setCarts] = useState([])
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const [productDetail, setProductDetail] = useState([])
    const [shoes, setShoes] = useState()
    const [images, setImages] = useState()
    const [sizeSelected, setSizeSelected] = useState('')
    const [sizeNumber, setSizeNumber] = useState(1)
    const [detailId, setProductDetailId] = useState('')
    const selectSize = (size, number, detailId) => {
        setSizeSelected(size);
        setSizeNumber(number);
        setProductDetailId(detailId);
        setCount(1);
    };


    const [count, setCount] = useState(1);

    const handleIncrement = () => {
        if (count < sizeNumber) setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const onFinish = async () => {
        try {
            await getProductDetail(id, setProductDetail);

            if (initialValues.userId) {
                await getListCart(initialValues.userId, setCarts, (total) => {
                    setTotal(total);
                });
            }
        } catch (error) {
            console.error("Error in onFinish:", error);
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
                await axios
                    .get(`${PATH.profile}/${user.username}`)
                    .then((res) => {

                        setInitialValues({
                            userId: res?.data?.user?._id,
                            username: res?.data?.user?.username,
                            email: res?.data?.user?.email,
                            phone: res?.data?.user?.phone,
                            address: res?.data?.user?.address,
                        });
                    });
            }
        };

        fetchData();
    }, [isAuthenticated]);

    useEffect(() => {
        getShoesCustomer(id, setShoes, setImages, setCanvas, selectSize)
    }, [id])

    useEffect(() => {
        getShoesCustomer(id, setShoes, setImages, setCanvas, selectSize)
        if (productDetail.shoes) {
            const matchingCartItem = cart.find(item => item.shoes_size_detail_id?._id === detailId);

            if (matchingCartItem) {
                const updatedQuantity = matchingCartItem.quantity + count;
                console.log(matchingCartItem.product.quantity);
                if (updatedQuantity > matchingCartItem.product.quantity) {
                    alert('sold out');
                } else {
                    AddCartDup(matchingCartItem._id, { quantity: updatedQuantity }, navigate);
                }
            } else {
                const newCart = {
                    account_id: initialValues.userId,
                    shoes_size_detail_id: detailId,
                    quantity: count
                };
                createCart(newCart, navigate);
            }
        }

    }, [cart], [productDetail])
    return (
        <>
            <Row style={{ margin: 40 }}>
                <Col span={14}>
                    <Row>
                        <Col span={4}>
                            {images?.map(image => {
                                return (
                                    <Image
                                        onClick={() => setCanvas(image.url)}
                                        preview={false}
                                        style={{
                                            marginBottom: 10,
                                            cursor: 'pointer',
                                            border: image?.url === canvas ? '1px solid black' : ''
                                        }}
                                        width={80}
                                        src={image.url}
                                    />
                                )
                            })}
                        </Col>
                        <Col offset={0.5} span={19}>
                            <Image
                                preview={false}
                                style={{ marginBottom: 10 }}
                                width={'80%'}
                                src={canvas}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={10}>
                    <Row>
                        <Title level={4}>{shoes?.name}</Title>
                    </Row>
                    <Row
                        style={{
                            marginTop: 20,
                            marginBottom: 20,
                            fontSize: 12,
                            color: '#a3a5a7'
                        }}
                    >
                        <span style={{ fontWeight: 700 }}>SKU:{' '} </span>{id}
                    </Row>
                    <Row
                        style={{
                            paddingTop: 15,
                            paddingBottom: 15,
                            borderTop: '1px solid #F5F5F5',
                            borderBottom: '1px solid #F5F5F5',
                            alignItems: 'center',
                        }}
                    >
                        {
                            shoes?.discount?.percent ? <Row
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 60,
                                    height: 35,
                                    backgroundColor: '#F5F5F5',
                                    margin: '0 10px',
                                    color: 'red',
                                    fontSize: 16,
                                    fontWeight: 700
                                }}
                            >
                                - {shoes?.discount?.percent}%
                            </Row> : ''
                        }



                        {
                            shoes?.discount?.percent ?
                                <>
                                    <Text type="danger" style={{ marginRight: 10, fontWeight: 650, fontSize: 20 }}>
                                        {(shoes?.price - (shoes?.price * shoes?.discount?.percent / 100)).toLocaleString('vi-VN')}₫
                                    </Text>
                                    <Text delete> {(shoes?.price)?.toLocaleString('vi-VN')}₫</Text>
                                </>
                                :
                                <Text type="danger" style={{ marginRight: 10, fontWeight: 650, fontSize: 20 }}>
                                    {(shoes?.price)?.toLocaleString('vi-VN')}₫
                                </Text>
                        }


                    </Row>
                    <Row
                        style={{
                            alignItems: 'center',
                            paddingTop: 20,
                            paddingBottom: 20,
                            borderTop: '1px solid #F5F5F5',
                            borderBottom: '1px solid #F5F5F5'
                        }}
                    >
                        <Col span={18}>
                            {shoes?.size.map((item, index) => {
                                return (
                                    <Button
                                        key={index}
                                        color="default"
                                        variant={sizeSelected === Object.keys(item)[0] ? "solid" : ''}
                                        className="size-button"
                                        onClick={() => selectSize(Object.keys(item)[0], Object.values(item)[0], Object.values(item)[1])}
                                    >
                                        {Object.keys(item)[0]}
                                    </Button>
                                );
                            })}
                        </Col>
                        <Col span={6}>
                            {
                                sizeNumber !== 0 ?
                                    `${sizeNumber} sản phẩm có sẵn`
                                    :
                                    `Tạm hết hàng`
                            }
                        </Col>
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
                            <InputNumber min={1} value={count} onChange={setCount} readOnly />
                            <Button onClick={handleIncrement} variant='filled' color='default' >+</Button>
                        </div>
                    </Row>
                    {
                        sizeNumber !== 0 ? <Row style={{ marginTop: 30 }}>
                            <div class="box-1" onClick={onFinish}>
                                <div class="btn btn-one">
                                    <span>THÊM VÀO GIỎ HÀNG</span>
                                </div>
                            </div>
                        </Row>
                            :
                            <Row style={{ marginTop: 30 }}>
                                <div class="box-1 unavailable">
                                    <div class="btn btn-one">
                                        <span>HẾT HÀNG</span>
                                    </div>
                                </div>
                            </Row>
                    }

                </Col>
            </Row>
            <Row>
                <CustomerFeedback shoes_id={id} userId={initialValues.userId} />
            </Row>
        </>
    );
};

export default ShoesDetail;
