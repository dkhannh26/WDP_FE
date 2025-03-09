import React from "react";
import { Route } from "react-router-dom";
import AccountModel from "../components/account/AccountModel";
import AccountTable from "../components/account/AccountTable";
import DiscountModel from "../components/discount/DiscountModel";
import DiscountTable from "../components/discount/DiscountTable";
import ImportModel from "../components/import/ImportModel";
import ImportTable from "../components/import/ImportTable";
import OrderTable from "../components/order/OrderTable";
import AccessoryTable from "../components/product-admin/AccessoryTable";
import PantTable from "../components/product-admin/PantTable";
import ProductDetail from "../components/product-admin/productDetail";
import ProductForm from "../components/product-admin/ProductForm";
import RacketTable from "../components/product-admin/RacketTable";
import ShoesTable from "../components/product-admin/ShoesTable";
import TshirtTable from "../components/product-admin/TshirtTable";
import ProfileTable from "../components/profile/ProfileModel";
import PantShirtSizeModel from "../components/size/PantShirtSizeModel";
import PantShirtSizeTable from "../components/size/PantShirtSizeTable";
import ShoesSizeModel from "../components/size/ShoesSizeModel";
import ShoesSizeTable from "../components/size/ShoesSizeTable";
import VoucherModel from "../components/voucher/VoucherModel";
import VoucherTable from "../components/voucher/VoucherTable";
import Account from "../pages/Account";
import { default as Discount, default as Voucher } from "../pages/Discount";
import Import from "../pages/Import";
import Dashboard from "../pages/intro/Dashboard";
import LoginAdmin from "../pages/loginAdmin";
import AccessoryAdmin from "../pages/product-admin/AccessoryAdmin";
import RacketAdmin from "../pages/product-admin/RacketAdmin";
import ShoesAdmin from "../pages/product-admin/ShoesAdmin";
import TshirtAdmin from "../pages/product-admin/TshirtAdmin";
import Profile from "../pages/Profile";
import Size from "../pages/Size";
import Statistic from "../pages/Statistic";
import BrandModel from "../components/brand/BrandModel";
import BrandTable from "../components/brand/BrandTable";

export const AdminRoutes = (
    <>
        <Route path="admin/login" element={<LoginAdmin />} />
        <Route path="admin" element={<Dashboard />}>
            <Route path="discount" element={<Discount />}>
                <Route index element={<DiscountTable />} />
                <Route path="create" element={<DiscountModel type="create" />} />
                <Route path="edit/:id" element={<DiscountModel type="edit" />} />
            </Route>
            <Route path="voucher" element={<Voucher />}>
                <Route index element={<VoucherTable />} />
                <Route path="create" element={<VoucherModel type="create" />} />
                <Route path="edit/:id" element={<VoucherModel type="edit" />} />
            </Route>
            <Route path="racket" element={<RacketAdmin />}>
                <Route index element={<RacketTable />} />
                <Route path="detail/:id" element={<ProductDetail />} />
                <Route path="create" element={<ProductForm typeAction="create" typeProduct="racket" />} />
                <Route path="edit/:id" element={<ProductForm typeAction="edit" typeProduct="racket" />} />
                {/* <Route path="edit/:id" element={<TshirtModel type="edit" />} /> */}
            </Route>
            <Route path="tshirt" element={<TshirtAdmin />}>
                <Route index element={<TshirtTable />} />
                <Route path="detail/:id" element={<ProductDetail />} />
                <Route path="create" element={<ProductForm typeAction="create" typeProduct="tshirt" />} />
                <Route path="edit/:id" element={<ProductForm typeAction="edit" typeProduct="tshirt" />} />
            </Route>
            <Route path="pant" element={<TshirtAdmin />}>
                <Route index element={<PantTable />} />
                <Route path="detail/:id" element={<ProductDetail />} />
                <Route path="create" element={<ProductForm typeAction="create" typeProduct="pant" />} />
                <Route path="edit/:id" element={<ProductForm typeAction="edit" typeProduct="pant" />} />
            </Route>
            <Route path="shoes" element={<ShoesAdmin />}>
                <Route index element={<ShoesTable />} />
                <Route path="detail/:id" element={<ProductDetail />} />
                <Route path="create" element={<ProductForm typeAction="create" typeProduct="shoes" />} />
                <Route path="edit/:id" element={<ProductForm typeAction="edit" typeProduct="shoes" />} />
            </Route>
            <Route path="accessory" element={<AccessoryAdmin />}>
                <Route index element={<AccessoryTable />} />
                <Route path="detail/:id" element={<ProductDetail />} />
                <Route path="create" element={<ProductForm typeAction="create" />} typeProduct="accessory" />
                <Route path="edit/:id" element={<ProductForm typeAction="edit" typeProduct="accessory" />} />
            </Route>
            <Route path="pantTshirtSize" element={<Size />}>
                <Route index element={<PantShirtSizeTable />} />
                <Route path="create" element={<PantShirtSizeModel type="create" />} />
                <Route path="edit/:id" element={<PantShirtSizeModel type="edit" />} />
            </Route>
            <Route path="shoesSize" element={<Size />}>
                <Route index element={<ShoesSizeTable />} />
                <Route path="create" element={<ShoesSizeModel type="create" />} />
                <Route path="edit/:id" element={<ShoesSizeModel type="edit" />} />
            </Route>
            <Route path="account" element={<Account />}>
                <Route index element={<AccountTable />} />
                <Route path="create" element={<AccountModel type="create" />} />
                <Route path="edit/:id" element={<AccountModel type="edit" />} />
            </Route>
            <Route path="import" element={<Import />}>
                <Route index element={<ImportTable />} />
                <Route path="create" element={<ImportModel type="create" />} />
                <Route path="edit/:id" element={<ImportModel type="edit" />} />
            </Route>
            <Route path="order" element={<Voucher />}>
                <Route index element={<OrderTable />} />
            </Route>
            <Route path="statistic" element={<Statistic />}></Route>
            <Route path="profile" element={<Profile />}>
                <Route index element={<ProfileTable />} />
            </Route>
            <Route path="brand" element={<Discount />}>
                <Route index element={<BrandTable />} />
                <Route path="create" element={<BrandModel type="create" />} />
                <Route path="edit/:id" element={<BrandModel type="edit" />} />
            </Route>
        </Route>
    </>
);