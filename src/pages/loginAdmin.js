import React, { useState, useRef } from "react";
import axios from "axios";
import { API_PATH, PATH } from "../config/api.config";

import { Button, Checkbox, Form, Input, notification } from "antd";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
const LoginAdmin = () => {
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated, setUsername, user, setUser } =
    useAuth(); // Get authentication state and functions
  const onFinish = (values) => {
    const { username, password } = values;
    try {
      let res = axios
        .post(`${API_PATH.admin}/login`, {
          username,
          password,
        })
        .then((res) => {
          console.log(res.data);
          if (res && res.data.EC === 0) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            setIsAuthenticated(true);
            notification.success({
              message: res.data.message,
              description: "success",
            });

            setTimeout(() => {
              navigate("/admin/profile");
              window.location.reload();
            }, 1000);
          }
        })
        .catch((err) => {
          if (err.response.status === 403) {
            notification.error({
              message: "Username or password is incorrect",
              description: "error",
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Form
        className="login-admin"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          textAlign: "left",
          padding: "30px 30px 6px 30px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          transform: "scale(1.5)",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginAdmin;
