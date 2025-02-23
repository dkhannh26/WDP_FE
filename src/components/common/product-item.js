import React from 'react';
import '../assets/css/product.css';
import { Card, Col, Rate, } from "antd";

const ProductItem = ( {img, name, price, originPrice, rate, discount} ) => {

    return (
        <Col span={6} style={{ padding: "0 15px", marginBottom: 10 }}>
            <Card className='product-item' hoverable bordered={false}>
                <img src={img} alt='' />
                <p className='product-name'>{name}</p>
                <p className='product-price'>{price}<span className='product-originPrice'>{originPrice}</span></p>
                <p><Rate disabled defaultValue={rate} className='product-rate' /></p>
                <p className='product-sale'>{discount}</p>
            </Card>
        </Col>

    );
};

export default ProductItem;