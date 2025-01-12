import React from "react";
import Layout from "../components/layout";
import Register from "../pages/Register";
import SuccessRegister from "../pages/SuccessRegister";
import User from "../pages/User";
import ResetPassword from "../pages/ResetPassword";
import Payment from '../pages/Payment';
import PaymentModel from '../components/payment/PaymentModel';
import Cart from '../pages/Cart';
import CartList from '../components/cart/CartList';
import OrderCustomer from '../components/order/OrderCustomer';
import { Route } from 'react-router-dom';
import About from '../pages/About';
import ExchangePolicy from '../pages/ExchangePolicy';
import Contact from '../pages/Contact';
import Product from '../pages/Product';
import Home from "../pages/Home";
import PantsCustomer from "../pages/product-customer/pant/PantsCustomer";
import PantDetail from "../pages/product-customer/pant/PantDetail";
import ShoesCustomer from "../pages/product-customer/shoes/ShoesCustomer";
import ShoesDetail from "../pages/product-customer/shoes/ShoesDetail";
import AccessoryCustomer from "../pages/product-customer/accessory/AccessoryCustomer";
import AccessoryDetail from "../pages/product-customer/accessory/AccessoryDetail";
import TshirtCustomer from "../pages/product-customer/tshirt/TshirtCustomer";
import TshirtDetail from "../pages/product-customer/tshirt/TshirtDetail";
export const CustomerRoutes = (
  <>
    <Route path="customer" element={<Layout />}>
      <Route path="profile" element={<User />}></Route>
      <Route path="register" element={<Register />}></Route>
      <Route path="order" element={<OrderCustomer />}></Route>
      <Route path="pant/:id" element={<PantDetail />} />
      <Route path="pant" element={<PantsCustomer />} />
      <Route path="shoes/:id" element={<ShoesDetail />} />
      <Route path="shoes" element={<ShoesCustomer />} />
      <Route path="accessory/:id" element={<AccessoryDetail />} />
      <Route path="accessory" element={<AccessoryCustomer />} />
      <Route path="tshirt/:id" element={<TshirtDetail />} />
      <Route path="tshirt" element={<TshirtCustomer />} />
      <Route path='about' element={<About />}></Route>
      <Route path='exchange-policy' element={<ExchangePolicy />}></Route>
      <Route path='contact' element={<Contact />}></Route>
      <Route path="product" element={<Product />}></Route>
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
