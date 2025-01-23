import { CommentOutlined, CreditCardOutlined, DropboxOutlined, TruckOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Col, Row, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import Title from 'antd/es/typography/Title';
import { default as React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    getListTshirt
} from "../services/product/tshirt.service";
import '../assets/css/home.css';
import Carousel1 from '../assets/images/carousel1.webp';
import Carousel2 from '../assets/images/carousel2.webp';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getHotBrand, getTop10 } from '../services/order.service';
const { Text } = Typography;
const Home = () => {
    const carouselRef = React.useRef(null);

    const nextSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.next();  // Điều khiển carousel tiến đến slide tiếp theo
        }
    };

    // Hàm chuyển đến slide trước đó
    const prevSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.prev();  // Điều khiển carousel quay lại slide trước đó
        }
    };
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedBrand, setSelectedBrand] = useState("Lining");
    const [top10, setTop10] = useState([]);
    const [hotBrand, setHotBrands] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        getTop10(setTop10);
        getHotBrand(setHotBrands);
    }, []);
    console.log(hotBrand);
    const filteredProducts = selectedCategory === "all"
        ? top10.flatMap(category => category.topProducts)
        : top10
            .filter(category => category._id === selectedCategory)
            .flatMap(category => category.topProducts);

    const filteredBrands = selectedBrand === "all"
        ? hotBrand.flatMap(brand => brand.hotBrands)
        : hotBrand
            .filter(brand => brand._id === selectedBrand)
            .flatMap(brand => brand.hotBrands);
    return (
        <div>
            <Carousel arrows effect="fade">
                <img src={Carousel1} alt='' />
                <img src={Carousel2} alt='' />
            </Carousel>
            <Row className='container' style={{ margin: "15px auto", padding: "0 24px" }}>
                <Col span={6} className='service-item'>
                    <TruckOutlined className='service-icon' />
                    <h2 className='service-title'>Free shipping</h2>
                    <p>With orders from 500k or more</p>
                </Col>
                <Col span={6} className='service-item'>
                    <CommentOutlined className='service-icon' />
                    <h2 className='service-title'>24/7 support</h2>
                    <p>Online / offline support 24/7</p>
                </Col>
                <Col span={6} className='service-item'>
                    <DropboxOutlined className='service-icon' />
                    <h2 className='service-title'>Free returns</h2>
                    <p>Within 7 days</p>
                </Col>
                <Col span={6} className='service-item'>
                    <CreditCardOutlined className='service-icon' />
                    <h2 className='service-title'>Order online</h2>
                    <p>Hotline: 0357 420 420</p>
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
                <div style={{ position: "relative", width: "100%", margin: "0 auto", marginTop: "3%" }}>
                    <div style={{
                        padding: "2%",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        borderBottom: "none"
                    }}>
                        <Row>
                            <Col span={5} style={{ paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedCategory === "all" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedCategory("all")}>Tất cả</Title>
                            </Col>
                            <Col span={5} style={{ paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedCategory === "Vợt cầu lông" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedCategory("Vợt cầu lông")}>Vợt cầu lông</Title>
                            </Col>
                            <Col span={5} style={{ paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedCategory === "Giày cầu lông" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedCategory("Giày cầu lông")}>Giày cầu lông</Title>
                            </Col>
                            <Col span={4} style={{ paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedCategory === "Áo cầu lông" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedCategory("Áo cầu lông")}>Áo cầu lông</Title>
                            </Col>
                            <Col span={4} style={{ paddingTop: "1%", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "2%", backgroundColor: selectedCategory === "Quần cầu lông" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedCategory("Quần cầu lông")}>Quần cầu lông</Title>
                            </Col>
                        </Row>
                    </div>
                    <Carousel ref={carouselRef} dots={false} slidesToShow={5} slidesToScroll={1} infinite>
                        {filteredProducts.map((product) => (
                            <div key={product.product_id} style={{ padding: "0 8px" }}>
                                <Card
                                    onClick={() => navigate(`/product/${product.product_id}`)}
                                    bordered={true}
                                    hoverable
                                    style={{ width: "95%" }}
                                    cover={<img alt={product.productName} style={{ width: "100%" }} src={`http://localhost:3000${product.image}`} />}
                                >
                                    <Meta
                                        title={product.productName}
                                        description={
                                            <>
                                                <p>Giá gốc: {product.productPrice}₫</p>
                                                {product.productDiscount ? (
                                                    <p>Giá khuyến mãi: {(product.productPrice - (product.productPrice * product.productDiscount) / 100)}₫ (-{product.productDiscount}%)</p>
                                                ) : (
                                                    <p>Chưa có khuyến mãi</p>
                                                )}
                                            </>
                                        }
                                    />
                                </Card>
                            </div>
                        ))}
                    </Carousel>


                    <div
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
                    </div>
                </div>
                <h2 className='home-item-title'>Hot Brands</h2>
                <div style={{ position: "relative", width: "100%", margin: "0 auto", marginTop: "3%" }}>
                    <div style={{
                        padding: "2%",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        borderBottom: "none"
                    }}>
                        <Row>
                            <Col span={5} style={{ paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedBrand === "Lining" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("Lining")}>Lining</Title>
                            </Col>
                            <Col span={5} style={{ paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedBrand === "Mizuno" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("Mizuno")}>Mizuno</Title>
                            </Col>
                            <Col span={5} style={{ paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedBrand === "Victor" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("Victor")}>Victor</Title>
                            </Col>
                            <Col span={4} style={{ paddingTop: "1%", borderRight: "1px solid rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedBrand === "SNB" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("SNB")}>SNB</Title>
                            </Col>
                            <Col span={4} style={{ paddingTop: "1%", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "2%", backgroundColor: selectedBrand === "Yonex" ? "lightblue" : "transparent" }}>
                                <Title level={4} onClick={() => setSelectedBrand("Yonex")}>Yonex</Title>
                            </Col>
                        </Row>
                    </div>
                    <Carousel ref={carouselRef} dots={false} slidesToShow={5} slidesToScroll={1} infinite>
                        {filteredBrands.map((product) => (
                            <div key={product.product_id} style={{ padding: "0 8px" }}>
                                <Card
                                    onClick={() => navigate(`/product/${product.product_id}`)}
                                    bordered={true}
                                    hoverable
                                    style={{ width: "95%" }}
                                    cover={<img alt={product.productName} style={{ width: "100%" }} src={`http://localhost:3000${product.image}`} />}
                                >
                                    <Meta
                                        title={product.productName}
                                        description={
                                            <>
                                                <p>Giá gốc: {product.productPrice}₫</p>
                                                {product.productDiscount ? (
                                                    <p>Giá khuyến mãi: {(product.productPrice - (product.productPrice * product.productDiscount) / 100)}₫ (-{product.productDiscount}%)</p>
                                                ) : (
                                                    <p>Chưa có khuyến mãi</p>
                                                )}
                                            </>
                                        }
                                    />
                                </Card>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

        </div>
    );
};

export default Home;