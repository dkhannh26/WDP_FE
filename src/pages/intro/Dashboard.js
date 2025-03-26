import React from "react";
import { Button, Image, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { menu } from "../../config/menu.config";
import { useAuth } from "../../components/context/AuthContext";
import Title from "antd/es/typography/Title";
import { Switch } from 'antd';
import styled from 'styled-components';
import engFlag from '../../assets/images/eng.png'
import VietFlag from '../../assets/images/VietFlag.svg.webp'
import { useTranslation } from "react-i18next";

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
  const { setIsAuthenticated, setUsername, user, setUser } =
    useAuth();

  const { t, i18n } = useTranslation();

  const handleLanguageChange = (checked) => {
    const newLanguage = checked ? 'vi' : 'en';
    i18n.changeLanguage(newLanguage);
  };
  console.log(user.username);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const onMenuClick = (menuItem) => {
    navigate(menuItem.key);
  };

  const CustomSwitch = styled(Switch)`
  &.ant-switch {
    background-color:#092C70;
    &:hover {
      background-color: #092C70; 
    }
  }
  &.ant-switch-checked {
    background-color:rgb(205, 49, 25); 
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
    top: '50%';
    left: '50%';
    ${'' /* transform: 'translate(-50%, -50%)'; */}
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
      <Layout
        style={{
          marginInlineStart: 200,
        }}
      >
        <Header
          style={{
            padding: '0 30px',
            background: colorBgContainer,
            display: "flex",
            alignItems: 'center',
            justifyContent: "space-between",
            paddingTop: 15,
            paddingRight: 15,
          }}
        >
          <div style={{ display: 'flex' }}>
            <Title style={{ fontSize: 17, paddingRight: 10 }}>
              {t('language')}:
            </Title>
            {'  '}
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
              display: 'flex'
            }}
          >
            <Title style={{ fontSize: 20, padding: 5 }}>
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
          {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;