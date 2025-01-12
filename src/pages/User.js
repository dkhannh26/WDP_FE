import React, { useEffect, useState } from "react";
import "../assets/css/profile.css";
import {
  Button,
  Col,
  Form,
  Input,
  List,
  notification,
  Row,
  Select,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import axios from "axios";
import { PATH } from "../config/api.config";
import { options } from "./ProvinceData";
import { TruckOutlined } from "@ant-design/icons";

const User = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [view, setView] = useState("profile");
  const { isAuthenticated, setIsAuthenticated, setUsername, user, setUser } =
    useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");

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
        });
      }
    };

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view);
    }
  }, [location.state]);

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
            // navigate("/customer/profile");
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
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Total Amount",
      dataIndex: "total_price",
      key: "total_price",
    },

    {
      title: "Transport",
      dataIndex: "status",
      key: "status",
    },
  ];

  const data = [
    {
      avatar:
        "	https://product.hstatic.net/1000344185/product/img_4125_4feb7a360b3b4f00bd2465a85ef2d9e3_small.jpg",
      title: "Ant Design Title 1",
      quantity: 2,
      price: (
        <p>
          <del>440,000₫</del>400,000₫
        </p>
      ),
      size: "M",
    },
    {
      avatar:
        "	https://product.hstatic.net/1000344185/product/img_4125_4feb7a360b3b4f00bd2465a85ef2d9e3_small.jpg",
      title: "Ant Design Title 2",
      quantity: 2,
      price: (
        <p>
          <del>440,000₫</del>400,000₫
        </p>
      ),
      size: "M",
    },
    {
      avatar:
        "	https://product.hstatic.net/1000344185/product/img_4125_4feb7a360b3b4f00bd2465a85ef2d9e3_small.jpg",
      title: "Ant Design Title 3",
      quantity: 2,
      price: (
        <p>
          <del>440,000₫</del>400,000₫
        </p>
      ),
      size: "M",
    },
    {
      avatar:
        "	https://product.hstatic.net/1000344185/product/img_4125_4feb7a360b3b4f00bd2465a85ef2d9e3_small.jpg",
      title: "Ant Design Title 4",
      quantity: 2,
      price: (
        <p>
          <del>440,000₫</del>400,000₫
        </p>
      ),
      size: "M",
    },
  ];

  return (
    <div className="container profile">
      <h1 className="profile-title">My Profile</h1>
      <Row className="profile-content">
        <Col span={6} className="profile-item">
          <div>
            <h3 className="account-title">Account</h3>
          </div>
          <div>
            <ul style={{ listStyleType: "circle" }}>
              <li>
                <Button
                  style={{ border: "none", marginBottom: 5, fontSize: "15px" }}
                  onClick={() => {
                    // navigate("/customer/profile");
                    setView("profile");
                  }}
                >
                  Account information
                </Button>
              </li>

              <li>
                <Button
                  style={{ border: "none", marginBottom: 5, fontSize: "15px" }}
                  onClick={() => {
                    // navigate("/customer/profile");
                    setView("changePassword");
                  }}
                >
                  Change password
                </Button>
              </li>

              <li>
                <Button
                  style={{ border: "none", marginBottom: 5, fontSize: "15px" }}
                  onClick={() => {
                    navigate("/customer/order");
                  }}
                >
                  Order
                </Button>
              </li>

              <li>
                <Button
                  style={{ border: "none", marginBottom: 5, fontSize: "15px" }}
                  onClick={() => {
                    localStorage.clear("token");
                    setIsAuthenticated(false);
                    setUsername("");
                    navigate("/customer");
                  }}
                >
                  Logout
                </Button>
              </li>
            </ul>
          </div>
        </Col>
        <Col span={18} className="profile-item">
          {view === "profile" ? (
            <>
              <h3 className="account-title">Account information</h3>
              <Form
                onFinish={onFinish}
                // variant={componentVariant}
                form={form}
                layout="vertical"
              >
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
                  <Select placeholder="Address" options={options} />
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
            </>
          ) : (
            <>
              <h3 className="account-title">Change Password</h3>
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
        </Col>
      </Row>
    </div>
  );
};

export default User;
