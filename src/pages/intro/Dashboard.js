import { Row, Col, Dropdown, Badge, Button, Image, Layout, Menu, Switch, theme, notification } from "antd";
import { BellOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import engFlag from '../../assets/images/eng.png';
import VietFlag from '../../assets/images/VietFlag.svg.webp';
import { useAuth } from "../../components/context/AuthContext";
import { menu } from "../../config/menu.config";
import { io } from "socket.io-client";
import { baseURL } from "../../config/api.config";
import {
  getListNotifications,
  readNotification,
} from "../../services/notification.service";
import StaffChat from "../../components/chatbox/StaffChat";
import Logo1 from "../../assets/chatstaff.jpg";
import Logo2 from "../../assets/close.jpg";
import { getListNotification } from "../../services/chat.service";
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
  const { setIsAuthenticated, setUsername, user, setUser } = useAuth() || { user: null };

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
    console.log(item.url);

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

  const { t, i18n } = useTranslation();
  const [showChat, setShowChat] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [chatNotifications, setChatNotifications] = useState([]); // New state for chat-specific notifications

  useEffect(() => {
    if (!user?.id || user?.role !== "staff") return;
    getListNotification(user.id, setChatNotifications, setNotificationCount);
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      socket.emit("join", user.id);
      console.log("Staff connected with ID:", user.id);
    });

    socket.on("getNotification", (data) => {
      if (
        data.senderId !== user.id &&
        (data.recipientId === user.id || !data.recipientId)
      ) {
        setNotificationCount(prev => prev + 1);
        setChatNotifications(prev => [...prev, { senderName: data.senderName, senderId: data.senderId }]);
        console.log("Notification received:", data);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, showChat]);

  const handleToggleChat = () => {
    setShowChat(prev => !prev);
  };

  const handleResetNotifications = () => {
    setNotificationCount(0);
    // Optionally clear chatNotifications here if desired
    // setChatNotifications([]);
  };
  useEffect(() => {
    setNotificationCount(chatNotifications.length);
  }, [chatNotifications]);
  const handleLanguageChange = (checked) => {
    const newLanguage = checked ? 'vi' : 'en';
    i18n.changeLanguage(newLanguage);
  };



  const CustomSwitch = styled(Switch)`
    &.ant-switch {
      background-color: #092C70;
      &:hover {
        background-color: #092C70;
      }
    }
    &.ant-switch-checked {
      background-color: rgb(205, 49, 25);
      &:hover {
        background-color: rgb(205, 49, 25) !important;
      }
    }
    .ant-switch-handle {
      width: 18px;
      height: 18px;
      top: 50%;
      transform: translateY(-50%);
      left: 2px;
    }
    .ant-switch-handle::before {
      background-color: #fff;
    }
  `;

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
      <Layout style={{ marginInlineStart: 200 }}>
        <Header style={{
          padding: '0 30px',
          background: colorBgContainer,
          display: "flex",
          alignItems: 'center',
          justifyContent: "space-between",
          paddingTop: 15,
          paddingRight: 15,
        }}>
          <div style={{ display: 'flex' }}>
            <Title style={{ fontSize: 17, paddingRight: 10 }}>
              {t('language')}:
            </Title>
            <CustomSwitch
              defaultChecked={i18n.language === 'vi'}
              onChange={handleLanguageChange}
              style={{ height: 26 }}
              padding='10px 0'
              checkedChildren={
                <Image
                  position='absolute'
                  width={30}
                  src={VietFlag}
                />}
              unCheckedChildren={
                <Image
                  position='absolute'
                  width={30}
                  src={engFlag}
                />}
            />
          </div>


          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >

            <Dropdown
              overlay={menuNotification}
              trigger={["click"]}
              onOpenChange={handleNotificationClick}

            >
              <Badge count={count} >
                <BellOutlined style={{ marginRight: 20, fontSize: 24, cursor: "pointer" }} />
              </Badge>
            </Dropdown>
            <Title style={{ fontSize: 20, paddingTop: 10 }}>
              {t('dashboard.hello')} {user.username}
            </Title>
            <Button
              onClick={() => {
                localStorage.clear("token");
                localStorage.clear("role");
                setIsAuthenticated(false);
                setUsername("");
                setUser("");
                navigate("/admin/login");
              }}
            >
              {t('button.log_out')}
            </Button>
          </div>
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
        {user?.role === "staff" && (
          <>
            <button
              onClick={handleToggleChat}
              style={{
                position: "fixed",
                bottom: "20px",
                marginBottom: "60px",
                right: "20px",
                width: "60px",
                height: "60px",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
                transition: "background-color 0.3s",
                backgroundColor: "white",
              }}
            >
              {showChat ? (
                <img
                  src={Logo1}
                  alt="Close Chat"
                  style={{ width: "40px", height: "40px" }}
                />
              ) : (
                <img
                  src={Logo2}
                  alt="Chat with Staff"
                  style={{ width: "40px", height: "40px" }}
                />
              )}
              {notificationCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}>
                  {notificationCount}
                </span>
              )}
            </button>
            {showChat && (
              <StaffChat
                userId={user?.id}
                onResetNotifications={handleResetNotifications}
                notifications={chatNotifications}
                setNotifications={setChatNotifications}
              />
            )}
          </>
        )}
      </Layout>
    </Layout>
  );
};

export default Dashboard;