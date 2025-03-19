import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Tooltip as TooltipChart, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Bar, LabelList } from 'recharts';
import { getRatingDetail } from '../../services/statistic.service';

const RatingDetail = () => {
    const year = 2025
    const [ratingDetails, setRatingDetail] = useState([]);

    useEffect(() => {
        getRatingDetail(setRatingDetail, year)
    }, [])

    console.log(ratingDetails);

    return (
        <div>
            Rating Detail
            <Row>
                <Col span={24} style={{ marginTop: 20 }}>
                    <div
                        style={{
                            padding: 40,
                            paddingBottom: 40,
                            backgroundColor: "white",
                            height: 350,
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <ResponsiveContainer>
                            <BarChart data={ratingDetails} layout="vertical">
                                <CartesianGrid strokeDasharray="3 1" />
                                <XAxis type="number" domain={[0, 5]} />
                                <YAxis type="productName" dataKey="productName" tick={{ fontSize: 13 }} />
                                <TooltipChart />
                                <Bar dataKey="averageStars" name="Average Rating" fill="#8884d8" background={{ fill: '#eee' }}>
                                    <LabelList dataKey="averageStar" position="right" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RatingDetail;