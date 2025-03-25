import { BellOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  notification,
  Row,
  theme,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../components/context/AuthContext";
import { baseURL } from "../../config/api.config";
import { menu } from "../../config/menu.config";
import {
  getListNotifications,
  readNotification,
} from "../../services/notification.service";
const { Header, Content, Footer, Sider } = Layout;

const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
};

const Dashboard = () => {
  const { setIsAuthenticated, setUsername, user, setUser } = useAuth();
  console.log(user.username);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const onMenuClick = (menuItem) => {
    navigate(menuItem.key);
  };

  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const socket = io(baseURL, {
    query: { token: localStorage.getItem("token") },
  });

  useEffect(() => {
    // Nhận tin nhắn từ server
    socket.on("newNotification", (data) => {
      const newNotification = {
        key: notifications.length + 1,
        label: data.message,
        url: data.url,
        created_at: data.created_at,
      };
      notification.info({
        message: "Thông báo mới",
        description: newNotification.label,
        placement: "topRight",
      });
      setNotifications((prev) => [newNotification, ...prev]);
      setCount((prev) => prev + 1);
    });

    socket.on("notificationCount", (data) => {
      setCount(data);
    });
    return () => {
      socket.off("newNotification");
      socket.off("notificationCount");
    };
  }, []);

  useEffect(() => {
    if (user.id) {
      getListNotifications(setNotifications, setCount, user.id);
    }
  }, [user.id]);

  const handleItemClick = (item) => {
    window.open(`/${item.url}`, "_blank");
  };

  const handleNotificationClick = (open) => {
    readNotification(user.id);
  };
  const menuNotification = (
    <Menu style={{ maxWidth: 500 }}>
      {notifications.map((item, index) => (
        <Menu.Item
          key={item.key}
          style={{
            backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
            padding: "10px",
          }}
          onClick={() => handleItemClick(item)}
        >
          <Row style={{ display: "inline-block" }}>
            <Col>{item.label}</Col>
            <Col>{item.created_at}</Col>
          </Row>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menu}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout
        style={{
          marginInlineStart: 200,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "15px 15px 0 0",
          }}
        >
          <Dropdown
            overlay={menuNotification}
            trigger={["click"]}
            onOpenChange={handleNotificationClick}
          >
            <Badge count={count}>
              <BellOutlined style={{ fontSize: 24, cursor: "pointer" }} />
            </Badge>
          </Dropdown>
          <Title style={{ fontSize: 20, padding: "10px 0 0 20px" }}>
            Hello {user.username}
          </Title>
          <Button
            style={{ marginLeft: 5 }}
            onClick={() => {
              localStorage.clear("token");
              localStorage.clear("role");
              setIsAuthenticated(false);
              setUsername("");
              setUser("");
              navigate("/admin/login");
            }}
          >
            Logout
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <Outlet></Outlet>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
