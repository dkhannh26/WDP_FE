import axios from "axios";
import React from "react";
import { API_PATH } from "../config/api.config";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import { notification } from "antd";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUsername, setUser } = useAuth();

  const onFinish = (values) => {
    const { email, password } = values;
    axios
      .post(`${API_PATH.admin}/login`, { username: email, password })
      .then((res) => {
        if (res && res.data.EC === 0) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("permissions", JSON.stringify(res.data.permissions));

          setIsAuthenticated(true);
          notification.success({
            message: "Login Successful",
            description: "Welcome to Admin Dashboard",
          });

          setTimeout(() => {
            navigate("/admin/profile");
            window.location.reload();
          }, 1000);
        }
      })
      .catch((err) => {
        notification.error({
          message: "Login Failed",
          description:
            err.response?.status === 403
              ? "Invalid email or password"
              : "An error occurred",
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Circles */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "linear-gradient(45deg, #ff6b6b, #ff8787)",
          borderRadius: "50%",
          top: "-100px",
          left: "-100px",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          background: "linear-gradient(45deg, #ffd700, #ffeb3b)",
          borderRadius: "50%",
          top: "-50px",
          left: "150px",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          background: "linear-gradient(45deg, #00c4cc, #40e0d0)",
          borderRadius: "50%",
          bottom: "-50px",
          left: "50%",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          background: "linear-gradient(45deg, #a855f7, #d8b4fe)",
          borderRadius: "50%",
          bottom: "-100px",
          right: "-100px",
          opacity: 0.8,
        }}
      />

      {/* Login Form */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "40px 30px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          LOGIN
        </h2>

        <Form
          name="login_form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="EMAIL"
              size="large"
              style={{
                border: "none",
                borderBottom: "1px solid #d9d9d9",
                borderRadius: 0,
                padding: "10px 0",
                fontSize: "16px",
                boxShadow: "none",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            style={{ marginTop: "20px" }}
          >
            <Input.Password
              placeholder="PASSWORD"
              size="large"
              style={{
                border: "none",
                borderBottom: "1px solid #d9d9d9",
                borderRadius: "0",
                padding: "10px 0",
                fontSize: "16px",
                boxShadow: "none",
              }}
            />
          </Form.Item>

          <div style={{ textAlign: "right", margin: "15px 0" }}>

          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "30px",
            }}
          >

            <Button
              type="primary"
              htmlType="submit"
              style={{
                background: "#1a3c5e",
                border: "none",
                borderRadius: "8px",
                padding: "10px 30px",
                fontSize: "16px",
                height: "auto",
                width: '100%'
              }}
            >
              SIGN IN
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginAdmin;