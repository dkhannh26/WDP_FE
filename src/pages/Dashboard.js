import React from "react";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { menu } from "../config/menu.config";
import { useAuth } from "../components/context/AuthContext";
import Title from "antd/es/typography/Title";
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
  const { isAuthenticated, setIsAuthenticated, setUsername, user, setUser } =
    useAuth();
  console.log(user.username);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const onMenuClick = (menuItem) => {
    navigate(menuItem.key);
  };

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
            justifyContent: "flex-end",
            paddingTop: 15,
            paddingRight: 15,
          }}
        >
          <Title style={{ fontSize: 20, padding: 5 }}>
            Hello {user.username}
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
            Logout
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              backgroundColor: "#e6e6e6",
            }}
          >
            <Outlet></Outlet>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
