import { Button, Col, Image, Row, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import { getProductDetail } from '../../services/product/product.service';
import { EditOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import CustomerFeedback from '../feedback/CustomerFeedback';
import { useAuth } from "../../components/context/AuthContext";
import { PATH } from "../../config/api.config";
import axios from 'axios';
const { Text } = Typography;

const ProductDetail = () => {
    const [canvas, setCanvas] = useState('https://top10hoabinh.com/wp-content/uploads/2022/10/anh-dang-load-2.jpg')
    const [product, setProduct] = useState()
    const [images, setImages] = useState()
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const editPath = location.pathname.replace('/detail/', '/edit/');
    const { t, i18n } = useTranslation();
    const { isAuthenticated, user } = useAuth();
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
                await axios.get(`${PATH.profile}/${user.username}`).then((res) => {
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
        getProductDetail(id, setProduct, setImages, setCanvas)

    }, [id])

    console.log('product', product);


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
                        <Title level={3} style={{ textAlign: 'left' }} >{product?.name}</Title>
                    </Row>
                    <Row
                        style={{
                            marginTop: 20,
                            marginBottom: 20,
                        }}
                    >
                        <span><Text style={{ fontSize: 16, fontWeight: 600 }}>{t('table.brand')}:{' '}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 400 }}>{product?.brand?.name}</Text></span>
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
                            product?.discount?.percent ? <Row
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
                                - {product?.discount?.percent}%
                            </Row> : ''
                        }



                        {
                            product?.discount?.percent ?
                                <>
                                    <Text type="danger" style={{ marginRight: 10, fontWeight: 650, fontSize: 20 }}>
                                        {(product?.price - (product?.price * product?.discount?.percent / 100)).toLocaleString('vi-VN')}₫
                                    </Text>
                                    <Text delete> {(product?.price)?.toLocaleString('vi-VN')}₫</Text>
                                </>
                                :
                                <Text type="danger" style={{ marginRight: 10, fontWeight: 650, fontSize: 20 }}>
                                    {(product?.price)?.toLocaleString('vi-VN')}₫
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
                        <Col span={24}>
                            {product?.size.map((item, index) => {
                                return (
                                    <div style={{ textAlign: "left" }}>
                                        <Space>
                                            <Text style={{ fontSize: 18 }}>{t('header.size')}: {item.size_name}</Text>
                                            <Text style={{ fontSize: 18 }}>
                                                {'-'} {t('table.quantity')}: {item.quantity}
                                            </Text>
                                        </Space>
                                    </div>
                                );
                            })}
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
                        <Space>
                            <Button icon={<EditOutlined />} size={30} onClick={() => navigate(editPath)}>
                                {t('button.edit')}
                            </Button>
                            {/* <Button danger>
                                {t('button.delete')}
                            </Button> */}
                        </Space>
                    </Row>
                </Col>
            </Row>
            <Row>
                <CustomerFeedback product_id={id} userId={initialValues.userId} />
            </Row>

        </>
    );
};

export default ProductDetail;
