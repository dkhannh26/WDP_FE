import { DownloadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  Select,
  Typography,
  Tooltip,
  Space,
  Alert,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { exportExcel, getStatistic } from "../services/statistic.service";
const Statistic = () => {
  const [year, setYear] = useState(2024);
  const [statistic, setStatistic] = useState([]);
  const [ordersByMonth, setOrderByMonth] = useState([]);
  const [numberOfCategory, setNumberOfCategory] = useState([]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setYear(value);
  };

  useEffect(() => {
    getStatistic(year, setStatistic, setOrderByMonth, setNumberOfCategory);
  }, [year]);

  console.log(ordersByMonth);

  return (
    <div>
      <Title level={2} style={{ margin: 0 }}>
        Brand Tracking
      </Title>
      <Row style={{}}>
        <Space>
          <Select
            defaultValue="2024"
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={[
              {
                value: "2024",
                label: "2024",
              },
              {
                value: "2023",
                label: "2023",
              },
              {
                value: "2022",
                label: "2022",
              },
            ]}
          />
          <Tooltip title="Download all document">
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                exportExcel(statistic, ordersByMonth, numberOfCategory);
              }}
            >
              Download
            </Button>
          </Tooltip>
        </Space>
      </Row>

      <Row gutter={16} style={{ margin: "20px 0" }}>
        <Col span={6}>
          <div style={areaNumberStyle}>
            <Typography style={{ textAlign: "left", fontSize: 18 }}>
              Revenue
            </Typography>
            <Title level={2} style={{ margin: 0 }}>
              {statistic?.revenue}₫
            </Title>
          </div>
        </Col>
        <Col span={6}>
          <div style={areaNumberStyle}>
            <Typography style={{ textAlign: "left", fontSize: 18 }}>
              Products sold
            </Typography>
            <Title level={2} style={{ margin: 0 }}>
              {statistic?.products}
            </Title>
          </div>
        </Col>
        <Col span={6}>
          <div style={areaNumberStyle}>
            <Typography style={{ textAlign: "left", fontSize: 18 }}>
              Buyers
            </Typography>
            <Title level={2} style={{ margin: 0 }}>
              {statistic?.accountNumber}
            </Title>
          </div>
        </Col>
        <Col span={6}>
          <div style={areaNumberStyle}>
            <Typography style={{ textAlign: "left", fontSize: 18 }}>
              Orders
            </Typography>
            <Title level={2} style={{ margin: 0 }}>
              {statistic?.orders}
            </Title>
          </div>
        </Col>
      </Row>
      <Row
        gutter={20}
        style={{
          // padding: '0 20px',
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Col span={12}>
          <div
            style={{
              marginRight: 0,
              backgroundColor: "white",
              height: 300,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
            }}
          >
            <ResponsiveContainer
              style={{ marginLeft: 20 }}
              width="90%"
              height="90%"
            >
              <AreaChart
                width={500}
                height={260}
                data={ordersByMonth}
                margin={{
                  top: 10,
                  right: 40,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
        <Col span={12}>
          <div
            style={{
              marginRight: 0,
              backgroundColor: "white",
              height: 300,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
            }}
          >
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                width={400}
                height={260}
                data={numberOfCategory}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="quantity"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const areaNumberStyle = {
  height: 120,
  width: "100%",
  backgroundColor: "white",
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  justifyContent: "center",
};

export default Statistic;
