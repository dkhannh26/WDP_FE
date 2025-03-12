import React from 'react';
import '../assets/css/product.css';
import { Card, Col, Pagination, Rate, Row, Select } from "antd";
import { FilterOutlined } from '@ant-design/icons';
import ProductItem from '../components/product-item';

const Product = () => {

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    return (
            <div style={{ width: 1200, margin: "auto" }}>
                <h1 style={{ fontSize: 30, margin: "30px 0", padding: "0 15px" }}>All products</h1>
                <div className='product-filter'>
                    <FilterOutlined /> Filter
                    <Select
                        defaultValue="Prices gradually increase"
                        style={{
                            marginLeft: 20
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: 'Prices gradually increase',
                                label: 'Prices gradually increase',
                            },
                            {
                                value: 'Prices gradually decrease',
                                label: 'Prices gradually decrease',
                            },
                        ]}
                    />
                </div>
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
                <Pagination align="center" defaultCurrent={1} total={50} defaultPageSize={20} style={{marginTop: 15}}/>
            </div>
    );
};

export default Product;