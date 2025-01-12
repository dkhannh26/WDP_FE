import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { layout, tailLayout } from "../../config/style.config";
import {
  createAccount,
  editAccount,
  editDiscount,
  getAccount,
  getDiscount,
} from "../../services/account.service";
import { options } from "../ProvinceData";
const AccountModel = ({ type }) => {
  const [date, setDate] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const onFinish = (values) => {
    const account = {
      username: values.username,
      email: values.email,
      phone: values.phone,
      address: values.address,
      deleted: values?.deleted,
      password: values?.password,
    };

    if (type === "create") {
      createAccount(account, navigate);
    } else {
      editAccount(id, account, navigate);
    }
  };

  useEffect(() => {
    if (type === "edit") getAccount(id, form);
  }, [id, type, form]);

  return (
    <>
      <Row>
        <Title level={3}>
          {type === "create" ? "New Staff Account" : "Edit Account"}
        </Title>
      </Row>
      <Row>
        <Col offset={4} span={12}>
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item
              name="username"
              label="Username"
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
              <Input disabled={type === "edit"} />
            </Form.Item>

            {type === "create" ? (
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message:
                      type === "create"
                        ? "Please input your password!"
                        : "Please input your new password!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            ) : (
              ""
            )}

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please select your address!",
                },
              ]}
            >
              <Select options={options} />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone number"
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
              <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {type === "create" ? "Insert" : "Edit"}
                </Button>
                <Button htmlType="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AccountModel;
