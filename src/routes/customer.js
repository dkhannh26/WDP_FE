import React from "react";
import { Route } from 'react-router-dom';
import CartList from '../components/cart/CartList';
import Layout from "../components/common/layout";
import OrderCustomer from '../components/order/OrderCustomer';
import PaymentModel from '../components/payment/PaymentModel';
import About from '../pages/intro/About';
import Cart from '../pages/Cart';
import Contact from '../pages/intro/Contact';
import ExchangePolicy from '../pages/intro/ExchangePolicy';
import Payment from '../pages/Payment';
import ProductCustomer from "../pages/product-customer/ProductCustomer";
import ProductDetail from "../pages/product-customer/ProductDetail";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import SuccessRegister from "../pages/SuccessRegister";
import User from "../pages/User";
import WishList from "../pages/WishList";
import Home from "../pages/intro/Home";

export const CustomerRoutes = (
  <>
    <Route path="customer" element={<Layout />}>
      <Route path="profile" element={<User />}></Route>
      <Route path="register" element={<Register />}></Route>
      <Route path="order" element={<OrderCustomer />}></Route>
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="pant/:id" element={<ProductDetail />} />
      <Route path="pant" element={<ProductCustomer />} />
      <Route path="racket/:id" element={<ProductDetail />} />
      <Route path="racket" element={<ProductCustomer />} />
      <Route path="shoes/:id" element={<ProductDetail />} />
      <Route path="shoes" element={<ProductCustomer />} />
      <Route path="accessory/:id" element={<ProductDetail />} />
      <Route path="accessory" element={<ProductCustomer />} />
      <Route path="tshirt/:id" element={<ProductDetail />} />
      <Route path="tshirt" element={<ProductCustomer />} />
      <Route path='about' element={<About />}></Route>
      <Route path='exchange-policy' element={<ExchangePolicy />}></Route>
      <Route path='contact' element={<Contact />}></Route>
      <Route path="product/:id" element={<ProductDetail />}></Route>
      <Route path="product" element={<ProductCustomer />}></Route>
      <Route path="wishlist" element={<WishList />}></Route>
      <Route path="" element={<Home />}></Route>
    </Route>
    <Route
      path="customer/register/:token"
      element={<SuccessRegister />}
    ></Route>

    <Route
      path="customer/update/:id/:token"
      element={<SuccessRegister />}
    ></Route>

    <Route
      path="customer/reset-password/:token"
      element={<ResetPassword />}
    ></Route>
    <Route path='customer'>
      <Route path='cart' element={<Cart />}>
        <Route index element={<CartList />} />
      </Route>
      <Route path='payment' element={<Payment />}>
        <Route index element={<PaymentModel />} />
      </Route>
    </Route>
  </>
);
