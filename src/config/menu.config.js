import {
  AreaChartOutlined,
  CodepenOutlined,
  CompressOutlined,
  DollarOutlined,
  FileDoneOutlined,
  ProductOutlined,
  TagOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";

let role = localStorage.getItem("role");
export const menu = [
  {
    icon: UserOutlined,
    title: "My Profile",
    role: "",
    key: "/profile",
  },
  {
    icon: UsergroupDeleteOutlined,
    title: "Account",
    role: "admin",
    key: "/account",
  },
  {
    icon: TagOutlined,
    title: "Discount",
    role: "admin",
    key: "/discount",
  },
  {
    icon: DollarOutlined,
    title: "Voucher",
    role: "admin",
    key: "/voucher",
  },
  {
    icon: AreaChartOutlined,
    title: "Statistic",
    role: "",
    key: "/statistic",
  },
  {
    icon: CodepenOutlined,
    title: "Import",
    role: "",
    key: "/import",
  },
  {
    icon: ProductOutlined,
    role: "",
    title: "Product",
    children: [
      {
        key: "tshirt",
        label: "T-shirt",
      },
      {
        key: "pant",
        label: "Pant",
      },
      {
        key: "shoes",
        label: "Shoes",
      },
      {
        key: "accessory",
        label: "Accessory",
      },
    ],
  },
  {
    icon: CompressOutlined,
    title: "Size",
    key: "/size",
    role: "admin",
    children: [
      {
        key: "/admin/pantTshirtSize",
        label: "Pant T-shirt Size",
      },
      {
        key: "/admin/shoesSize",
        label: "Shoes Size",
      },
    ],
  },
  {
    icon: FileDoneOutlined,
    title: "Order",
    key: "/order",
    role: "staff",
  },
].map((item, index) => {
  if (item.role === "") {
    return {
      key: "/admin" + item.key,
      icon: React.createElement(item.icon),
      label: item.title,
      children: item.children,
    };
  } else if (item.role === role) {
    console.log(role);
    return {
      key: "/admin" + item.key,
      icon: React.createElement(item.icon),
      label: item.title,
      children: item.children,
    };
  }
});
