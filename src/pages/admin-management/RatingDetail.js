import { Col, Row, Image, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Tooltip as TooltipChart, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Bar, LabelList } from 'recharts';
import { getRatingDetail } from '../../services/statistic.service';
import { useLocation } from 'react-router-dom';

const RatingDetail = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const year = queryParams.get('year');
    const [ratingDetails, setRatingDetail] = useState([]);

    useEffect(() => {
        getRatingDetail(setRatingDetail, year);
    }, []);

    console.log(ratingDetails);

    const shortenProductName = (name) => {
        return name.length > 40 ? `${name.substring(0, 17)}...` : name;
    };

    const CustomTick = ({ x, y, payload, ratingDetails }) => {
        const productName = payload.value;
        const index = payload.index;
        const reviewCount = ratingDetails[index].reviewCount;
        const shortenedName = shortenProductName(productName);

        const imageUrl = `http://localhost:3000/images/upload/${ratingDetails[index]?.productId}/${ratingDetails[index]?.image?.imageId}${ratingDetails[index]?.image?.fileExtension}`;

        return (
            <g transform={`translate(${x},${y})`}>
                <foreignObject x={-340} y={-20} width={50} height={50}>
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        <Image
                            src={imageUrl}
                            width={50}
                            height={50}
                            style={{ borderRadius: 4, border: '1px solid #d9d9d9' }}
                            preview={true}
                            onError={(e) => {
                                e.target.src = "";
                            }}
                        />
                    </div>
                </foreignObject>

                <text
                    x={-280}
                    y={0}
                    textAnchor="start"
                    fontSize={14}
                    fill="#333"
                >
                    <tspan x={-280} dy={0}>{shortenedName}</tspan>
                    <tspan x={-280} dy={16} fontSize={12} fill="#666">({reviewCount} Lượt đánh giá)</tspan>
                </text>
            </g>
        );
    };

    return (
        <div>
            <Typography.Title level={3}>
                Rating Details
            </Typography.Title>
            <Row>
                <Col span={24} style={{ marginTop: 20 }}>
                    <div
                        style={{
                            padding: 0,
                            paddingBottom: 40,
                            backgroundColor: "white",
                            height: "auto",
                            borderRadius: 10,
                            display: "flex",
                        }}
                    >
                        <ResponsiveContainer width="100%" height={ratingDetails.length * 50 + 100}>
                            <BarChart
                                data={ratingDetails}
                                barCategoryGap="40%"
                                layout="vertical"
                                margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 1" />
                                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 14, fill: '#333' }} />
                                <YAxis
                                    type="category"
                                    dataKey="productName"
                                    tick={<CustomTick ratingDetails={ratingDetails} />}
                                    width={350}
                                    tickMargin={10}
                                />
                                <TooltipChart />
                                <Bar dataKey="averageStars" name="Average Rating" fill="#8884d8" background={{ fill: '#eee' }}>
                                    <LabelList
                                        dataKey="averageStars"
                                        position="right"
                                        fill="#333"
                                        fontSize={14}
                                    />
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