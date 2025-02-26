import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

const Layout = () => {
    return (
        <>
            <Header />
            <div style={{ minHeight: '42vh' }}>
                <Outlet></Outlet>
            </div>
            <Footer />
        </>
    );
};

export default Layout;