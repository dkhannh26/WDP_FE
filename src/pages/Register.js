import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
} from "antd";
import "../assets/css/register.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { PATH } from "../config/api.config";
import { options } from "./ProvinceData";

const Register = () => {
  const [componentVariant, setComponentVariant] = useState("filled");
  const onFinish = async (values) => {
    // const res = await createUserApi(name, email, password);
    const res = await axios.post(`${PATH.register}`, values);
    if (res.data.success) {
      notification.success({
        message: res.data.message,
        // description: "success",
      });
      //   navigate("/login");
    } else {
      notification.error({
        message: res.data.message,
        description: "error",
      });
    }
    console.log("Success:", res);
  };

  return (
    <Row className="container flex-center">
      <Col span={12} className="register-item">
        <h1 className="register-title">Register</h1>
      </Col>
      <Col span={12} className="register-item">
        <Form
          onFinish={onFinish}
          variant={componentVariant}
          rules={[
            {
              required: true,
              message: "Please fill out this field.",
            },
          ]}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
              {
                pattern: /^[a-zA-Z0-9]{3,}$/,
                message:
                  "Username must have at least 3 letters, and only contain letters and numbers",
              },
            ]}
          >
            <Input placeholder="Username" className="register-input" />
          </Form.Item>
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "Please select your address!",
              },
            ]}
          >
            <Select placeholder="Address" options={options} />

            {/* <Input placeholder="Address" className="register-input" /> */}
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits!",
              },
            ]}
          >
            <Input placeholder="Phone" className="register-input" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Email" className="register-input" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Password" className="register-input" />
          </Form.Item>
          <div className="login-pop-recaptcha" style={{ fontSize: 14 }}>
            This site is protected by reCAPTCHA and the Google
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              Privacy Policy{" "}
            </a>
            and{" "}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              Terms of Service{" "}
            </a>
            apply.
          </div>
          <Row>
            <Form.Item>
              <Button
                className="login-pop-btn"
                style={{ width: 120, height: 55, marginTop: 20 }}
                htmlType="submit"
              >
                SIGN UP
              </Button>
            </Form.Item>
          </Row>
          <Form.Item>
            <Button
              style={{ marginTop: 15, color: "black", padding: 0 }}
              type="link"
              href="/customer"
            >
              <ArrowLeftOutlined />
              Back to Home
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
