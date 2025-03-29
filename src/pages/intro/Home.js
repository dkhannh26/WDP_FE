import { CommentOutlined, CreditCardOutlined, DropboxOutlined, LeftOutlined, RightOutlined, TruckOutlined } from '@ant-design/icons';
import { Card, Carousel, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import Title from 'antd/es/typography/Title';
import { default as React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/css/home.css';
import Carousel1 from '../../assets/images/carousel1.webp';
import Carousel2 from '../../assets/images/carousel2.webp';
import Carousel3 from '../../assets/images/carousel3.webp';
import Carousel4 from '../../assets/images/carousel4.webp';
import Carousel5 from '../../assets/images/carousel5.webp';
import Carousel6 from '../../assets/images/carousel6.webp';
import NoImage from '../../assets/images/no-image.jpg';
import { getHotBrand, getTop10 } from '../../services/order.service';
import { useTranslation } from "react-i18next";
const Home = () => {

    const { t, i18n } = useTranslation();

    const carouselRef = React.useRef(null);

    const nextSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.next();
        }
    };

    const prevSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.prev();
        }
    };
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedBrand, setSelectedBrand] = useState("Lining");
    const [top10, setTop10] = useState([]);
    const [hotBrand, setHotBrands] = useState([]);
    const navigate = useNavigate();
    const filteredProducts = selectedCategory === "all"
        ? (top10?.flatMap(category => category.topProducts) || [])
        : (top10
            ?.filter(category => category._id === selectedCategory)
            .flatMap(category => category.topProducts) || []);

    const filteredBrands = selectedBrand === "all"
        ? (hotBrand?.flatMap(brand => brand.hotBrands) || [])
        : (hotBrand
            ?.filter(brand => brand._id === selectedBrand)
            .flatMap(brand => brand.hotBrands) || []);
    console.log(filteredProducts);
    console.log(filteredBrands);
    useEffect(() => {
        getTop10(setTop10);
        getHotBrand(setHotBrands);
    }, []);
    return (
        <div>
            <Carousel arrows autoplay autoplaySpeed={5000}>
                <img src={Carousel6} alt='' />
                <img src={Carousel1} alt='' />
                <img src={Carousel2} alt='' />
                <img src={Carousel3} alt='' />
                <img src={Carousel4} alt='' />
                <img src={Carousel5} alt='' />
            </Carousel>
            <Row className='container' style={{ margin: "15px auto", padding: "0 24px" }}>
                <Col span={6} className='service-item'>
                    <TruckOutlined className='service-icon' />
                    <h2 className='service-title'>{t('home.free_shipping')}</h2>
                    <p>{t('home.free_shipping2')}</p>
                </Col>
                <Col span={6} className='service-item'>
                    <CommentOutlined className='service-icon' />
                    <h2 className='service-title'>{t('home.24/7_support')}</h2>
                    <p>{t('home.24/7_support2')}</p>
                </Col>
                <Col span={6} className='service-item'>
                    <DropboxOutlined className='service-icon' />
                    <h2 className='service-title'>{t('home.free_returns')}</h2>
                    <p>{t('home.free_returns2')}</p>
                </Col>
                <Col span={6} className='service-item'>
                    <CreditCardOutlined className='service-icon' />
                    <h2 className='service-title'>{t('home.order_online')}</h2>
                    <p>{t('home.order_online2')}: 0292 7301 988</p>
                </Col>
            </Row>
            {/* <div className='container'>
                <h2 className='home-item-title'>BEST-SELLING ITEMS</h2>
                <Row>
                    <ProductItem
                        img="https://product.hstatic.net/1000344185/product/1.1_64036a3bf99642a1bbde50dd46f9d05f_master.jpg"
                        name='NOMAD DENIM SHORTS - WASHED BLUE'
                        price='500,000₫'
                        originPrice='550,000₫'
                        rate={1}
                        discount='-9%'
                    />
                </Row>
            </div> */}
            <div className='container'>
                <h2 className='home-item-title'>Hot Product</h2>
                <div style={{ position: "relative", width: "100%", margin: "0 auto", marginTop: "3%", border: "1px solid rgba(0, 0, 0, 0.2)", }} className='hot-product'>
                    <div style={{
                        paddingTop: "2%",
                        paddingBottom: "2%",
                        borderBottom: "none"
                    }}>
                        <Row>
                            <Col flex="1" onClick={() => setSelectedCategory("all")} style={{ backgroundColor: selectedCategory === "all" ? "rgb(200 46 50)" : "transparent" }}>
                                <Title level={4} style={{ color: selectedCategory === "all" ? "white" : "black" }}>Tất cả</Title>
                            </Col>
                            <Col flex="1" onClick={() => setSelectedCategory("Vợt cầu lông")} style={{ backgroundColor: selectedCategory === "Vợt cầu lông" ? "rgb(200 46 50)" : "transparent", color: selectedCategory === "Vợt cầu lông" ? "white" : "black" }}>
                                <Title level={4} style={{ color: selectedCategory === "Vợt cầu lông" ? "white" : "black" }}>Vợt cầu lông</Title>
                            </Col>
                            <Col flex="1" onClick={() => setSelectedCategory("Giày cầu lông")} style={{ backgroundColor: selectedCategory === "Giày cầu lông" ? "rgb(200 46 50)" : "transparent", color: selectedCategory === "Giày cầu lông" ? "white" : "black" }}>
                                <Title level={4} style={{ color: selectedCategory === "Giày cầu lông" ? "white" : "black" }}>Giày cầu lông</Title>
                            </Col>
                            <Col flex="1" onClick={() => setSelectedCategory("Áo cầu lông")} style={{ backgroundColor: selectedCategory === "Áo cầu lông" ? "rgb(200 46 50)" : "transparent", color: selectedCategory === "Áo cầu lông" ? "white" : "black" }}>
                                <Title level={4} style={{ color: selectedCategory === "Áo cầu lông" ? "white" : "black" }}>Áo cầu lông</Title>
                            </Col>
                            <Col flex="1" onClick={() => setSelectedCategory("Quần cầu lông")} style={{ backgroundColor: selectedCategory === "Quần cầu lông" ? "rgb(200 46 50)" : "transparent", color: selectedCategory === "Quần cầu lông" ? "white" : "black" }}>
                                <Title level={4} style={{ color: selectedCategory === "Quần cầu lông" ? "white" : "black" }}>Quần cầu lông</Title>
                            </Col>
                        </Row>
                    </div>
                    <Carousel ref={carouselRef} dots={false} slidesToShow={5} slidesToScroll={1} infinite style={{ padding: "10px" }}>
                        {filteredProducts.map((product) => (
                            <div key={product.product_id} style={{ marginRight: "0px", width: "20%", display: "flex", justifyContent: "center" }}>
                                <Card
                                    onClick={() => navigate(`/customer/product/${product.product_id}`)}
                                    bordered={true}
                                    hoverable
                                    style={{ width: "95%" }}
                                    cover={<img alt={product.productName} style={{ width: "100%", height: "220px" }} src={product.image ? `http://localhost:3000${product.image}` : NoImage} />}
                                >
                                    <Meta
                                        title={product.productName}
                                        description={
                                            <>
                                                <p>{t('home.origin_price')}: {product.productPrice}₫</p>
                                                {product.productDiscount ? (
                                                    <p>{t('home.promotional_price')}: {(product.productPrice - (product.productPrice * product.productDiscount) / 100)}₫ (-{product.productDiscount}%)</p>
                                                ) : (
                                                    <p>{t('home.no_promotions')}</p>
                                                )}
                                            </>
                                        }
                                    />
                                </Card>
                            </div>
                        ))}
                    </Carousel>


                    {/* <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                            left: "0",
                            zIndex: 1,
                        }}
                    >
                        <LeftOutlined onClick={prevSlide} style={{ fontSize: "24px", cursor: "pointer" }} />
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                            right: "0",
                            zIndex: 1,
                        }}
                    >
                        <RightOutlined onClick={nextSlide} style={{ fontSize: "24px", cursor: "pointer" }} />
                    </div> */}
                </div>
                <h2 className='home-item-title'>{t('home.hot_brands')}</h2>
                <div style={{ position: "relative", width: "100%", margin: "0 auto", marginTop: "3%", border: "1px solid rgba(0, 0, 0, 0.2)", }} className='hot-product'>
                    <div style={{
                        paddingTop: "2%",
                        paddingBottom: "2%",
                        borderBottom: "none"
                    }}>
                        <Row>
                            {/* <Col span={5} style={{ cursor: "pointer", paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedBrand === "Lining" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("Lining")}>Lining</Title>
                            </Col>
                            <Col span={5} style={{ cursor: "pointer", paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedBrand === "Mizuno" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("Mizuno")}>Mizuno</Title>
                            </Col>
                            <Col span={5} style={{ cursor: "pointer", paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedBrand === "Victor" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("Victor")}>Victor</Title>
                            </Col>
                            <Col span={4} style={{ cursor: "pointer", paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedBrand === "SNB" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("SNB")}>SNB</Title>
                            </Col>
                            <Col span={4} style={{ cursor: "pointer", paddingTop: "1%", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "2%", backgroundColor: selectedBrand === "Yonex" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("Yonex")}>Yonex</Title>
                            </Col> */}

                            <Col flex="1" onClick={() => setSelectedCategory("Lining")} style={{ backgroundColor: selectedCategory === "Lining" ? "rgb(200 46 50)" : "transparent" }}>
                                <Title level={4} style={{ color: selectedCategory === "Lining" ? "white" : "black" }}>Lining</Title>
                            </Col>
                            <Col flex="1" onClick={() => setSelectedCategory("Mizuno")} style={{ backgroundColor: selectedCategory === "Mizuno" ? "rgb(200 46 50)" : "transparent", color: selectedCategory === "Mizuno" ? "white" : "black" }}>
                                <Title level={4} style={{ color: selectedCategory === "Mizuno" ? "white" : "black" }}>Mizuno</Title>
                            </Col>
                            <Col flex="1" onClick={() => setSelectedCategory("Victor")} style={{ backgroundColor: selectedCategory === "Victor" ? "rgb(200 46 50)" : "transparent", color: selectedCategory === "Victor" ? "white" : "black" }}>
                                <Title level={4} style={{ color: selectedCategory === "Victor" ? "white" : "black" }}>Victor</Title>
                            </Col>
                            <Col flex="1" onClick={() => setSelectedCategory("SNB")} style={{ backgroundColor: selectedCategory === "SNB" ? "rgb(200 46 50)" : "transparent", color: selectedCategory === "SNB" ? "white" : "black" }}>
                                <Title level={4} style={{ color: selectedCategory === "SNB" ? "white" : "black" }}>SNB</Title>
                            </Col>
                            <Col flex="1" onClick={() => setSelectedCategory("Yonex")} style={{ backgroundColor: selectedCategory === "Yonex" ? "rgb(200 46 50)" : "transparent", color: selectedCategory === "Yonex" ? "white" : "black" }}>
                                <Title level={4} style={{ color: selectedCategory === "Yonex" ? "white" : "black" }}>Yonex</Title>
                            </Col>
                        </Row>
                    </div>
                    <Row style={{ width: '100%', padding: 10 }}>
                        {filteredBrands.map((product) => (
                            <div key={product.product_id} style={{ marginRight: "0px", width: "20%", display: "flex", justifyContent: "center" }}>
                                <Card
                                    onClick={() => navigate(`/customer/product/${product.product_id}`)}
                                    bordered={true}
                                    hoverable
                                    style={{ width: "95%" }}
                                    cover={
                                        <img
                                            alt={product.productName}
                                            style={{ width: "100%", height: "220px" }}
                                            src={product.image ? `http://localhost:3000${product.image}` : NoImage}
                                        />
                                    }
                                >
                                    <Meta
                                        title={product.productName}
                                        description={
                                            <>
                                                <p>{t('home.origin_price')}: {product.productPrice}₫</p>
                                                {product.productDiscount ? (
                                                    <p>{t('home.promotional_price')}: {(product.productPrice - (product.productPrice * product.productDiscount) / 100)}₫ (-{product.productDiscount}%)</p>
                                                ) : (
                                                    <p>{t('home.no_promotions')}</p>
                                                )}
                                            </>
                                        }
                                    />
                                </Card>
                            </div>
                        ))}
                    </Row>
                </div>
            </div>

        </div>
    );
};

export default Home;