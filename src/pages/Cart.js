import { Breadcrumb, Divider, Layout, theme } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';
import { Outlet } from 'react-router-dom';
const { Header, Content, Footer } = Layout;
const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            {/* <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                />
            </Header> */}
            <Content
                style={{
                    padding: '0 48px',
                    textAlign: 'center',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Cart</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Title level={2}>Giỏ hàng của bạn</Title>
                    <div style={{ width: '5%', margin: '0 auto' }}>
                        <Divider style={{ borderWidth: '5px', borderColor: 'black' }} />
                    </div>
                    <Outlet></Outlet>
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};
export default App;