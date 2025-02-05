import React, { useEffect, useState } from "react";
import "../../assets/css/profile.css";

import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Table,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";

import axios from "axios";
import { PATH } from "../../config/api.config";
import { options } from "./../ProvinceData";

import "../../assets/css/profile.css";
const ProfileTable = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("profile");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated, setUsername, user, setUser } =
    useAuth();

  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        await axios.get(`${PATH.profile}/${user.username}`).then((res) => {
          console.log(res.data.user);
          setInitialValues({
            username: res?.data?.user?.username,
            email: res?.data?.user?.email,
            phone: res?.data?.user?.phone,
            address: res?.data?.user?.address,
          });
          // let orders = res?.data?.user?.order_id;
        });
      }
    };

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);
  const onChangePassword = (values) => {
    const { oldPassword, newPassword } = values;
    // Add API call logic here to change password
    try {
      axios
        .put(`${PATH.profile}/change-password/${user.username}`, {
          oldPassword,
          newPassword,
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.success) {
            notification.success({
              message: res.data.message,
              description: "success",
            });

            setTimeout(
              () => {
                window.location.reload();
              },
              setView("profile"),
              1000
            );
          } else {
            notification.error({
              message: res.data.message,
              description: "error",
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const onFinish = (values) => {
    const { email, phone, address } = values;

    try {
      axios
        .put(`${PATH.updateProfile}/${user.username}`, {
          email,
          phone,
          address,
        })
        .then((res) => {
          if (res.data.success) {
            notification.success({
              message: res.data.message,
              description: "success",
            });
            // setIsAuthenticated(true);
            setUser({ ...user, email, phone, address });
            setTimeout(() => window.location.reload(), 1000);
          } else {
            notification.error({
              message: res.data.message,
              description: "error",
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Row>
        {view === "profile" ? (
          <>
            <Col>
              <Button
                style={{
                  border: "none",
                  marginBottom: 5,
                  fontSize: "15px",
                  backgroundColor: "#FFFFFF",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  // navigate("/customer/profile");
                  setView("changePassword");
                }}
              >
                Change password
              </Button>
            </Col>
            <Col span={6} offset={6}>
              <h3 className="account-title">Account information</h3>
            </Col>
          </>
        ) : (
          <>
            {" "}
            <Col>
              <Button
                style={{
                  border: "none",
                  marginBottom: 5,
                  fontSize: "15px",
                  backgroundColor: "#FFFFFF",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  // navigate("/customer/profile");
                  setView("profile");
                }}
              >
                Back to profile
              </Button>
            </Col>
            <Col span={6} offset={6}>
              <h3 className="account-title">Change password</h3>
            </Col>
          </>
        )}
      </Row>
      <div className="container profile" style={{}}>
        {view === "profile" ? (
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                disabled={true}
                placeholder="Username"
                className="register-input"
              />
            </Form.Item>
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
              <Input placeholder="Email" className="register-input" />
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
              <Input placeholder="Phone" className="register-input" />
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
              <Select
                placeholder="Address"
                options={options}
                style={{ height: 64, textAlign: "center" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  marginRight: "1%",
                  height: "auto",
                  fontSize: "16px",
                }}
              >
                Save
              </Button>
              <Button
                color="default"
                variant="solid"
                type="default"
                onClick={() => {
                  form.setFieldsValue(initialValues);
                }}
                style={{ height: "auto", fontSize: "16px" }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <>
            <Form
              onFinish={onChangePassword}
              // variant={componentVariant}
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="oldPassword"
                label="Old password"
                rules={[
                  {
                    required: true,
                    message: "Please input your old password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Old password"
                  className="register-input"
                />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="New Password"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  {},
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  className="register-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  visibilityToggle={false}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    marginRight: "1%",
                    height: "auto",
                    fontSize: "16px",
                  }}
                >
                  Save
                </Button>
                <Button
                  color="default"
                  variant="solid"
                  type="default"
                  onClick={() => {
                    setView("profile");
                  }}
                  style={{ height: "auto", fontSize: "16px" }}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileTable;
