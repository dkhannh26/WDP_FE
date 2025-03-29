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
import { checkPermission } from "../utils/permission";
import { useTranslation } from "react-i18next";

const User = () => {
  const location = useLocation();


  const { t, i18n } = useTranslation();

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
    password: "",
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
            password: res?.data?.user?.password,
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
    let { oldPassword, newPassword } = values;
    // Add API call logic here to change password
    if (initialValues.password === null) oldPassword = null;
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

  return (
    <div className="container profile">
      <h1 className="profile-title">{t('header.my_account')}</h1>
      <Row className="profile-content">
        <Col span={6} className="profile-item">
          <div>
            <h3 className="account-title">{t('profile.label')}</h3>
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
                  {t('profile.information')}
                </Button>
              </li>

              {
                checkPermission('changePassword') && <li>
                  <Button
                    style={{ border: "none", marginBottom: 5, fontSize: "15px" }}
                    onClick={() => {
                      // navigate("/customer/profile");
                      setView("changePassword");
                    }}
                  >
                    {t('profile.change_pass')}
                  </Button>
                </li>

              }

              <li>
                <Button
                  style={{ border: "none", marginBottom: 5, fontSize: "15px" }}
                  onClick={() => {
                    navigate("/customer/order");
                  }}
                >
                  {t('profile.order')}
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
                  {t('profile.log_out')}
                </Button>
              </li>
            </ul>
          </div>
        </Col>
        <Col span={18} className="profile-item">
          {view === "profile" ? (
            <>
              <h3 className="account-title">{t('profile.information')}</h3>
              <Form
                onFinish={onFinish}
                // variant={componentVariant}
                form={form}
                layout="vertical"
              >
                <Form.Item
                  name="username"
                  label={t('profile.username')}
                  rules={[
                    {
                      required: true,
                      message: t('validate.username'),
                    },
                  ]}
                >
                  <Input
                    disabled={true}
                    placeholder={t('profile.username')}
                    className="register-input"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: t('validate.email'),
                    },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input disabled={!checkPermission('editProfile')} placeholder="Email" className="register-input" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={t('profile.phone_number')}
                  rules={[
                    {
                      required: true,
                      message: t('validate.phone_number'),
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits!",
                    },
                  ]}
                >
                  <Input disabled={!checkPermission('editProfile')} placeholder="Phone" className="register-input" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label={t('profile.address')}
                  rules={[
                    {
                      required: true,
                      message: t('validate.address'),
                    },
                  ]}
                >
                  <Select disabled={!checkPermission('editProfile')} placeholder="Address" options={options} />
                </Form.Item>
                {
                  checkPermission('editProfile') &&
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        marginRight: "1%",
                        height: "auto",
                        fontSize: "16px",
                        padding: "5px 10px"
                      }}
                    >
                      {t('button.save')}
                    </Button>
                    <Button
                      color="default"
                      variant="solid"
                      type="default"
                      onClick={() => {
                        form.setFieldsValue(initialValues);
                      }}
                      style={{ height: "auto", fontSize: "16px", padding: "5px 10px" }}
                    >
                      {t('button.cancel')}
                    </Button>
                  </Form.Item>
                }
              </Form>
            </>
          ) : (
            <>
              <h3 className="account-title">{t('profile.change_pass')}</h3>
              <Form
                onFinish={onChangePassword}
                // variant={componentVariant}
                form={form}
                layout="vertical"
              >
                {initialValues.password != null ? (
                  <Form.Item
                    name="oldPassword"
                    label={t('profile.old_pass')}
                    rules={[
                      {
                        required: true,
                        message: t('validate.old_pass'),
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Old password"
                      className="register-input"
                    />
                  </Form.Item>
                ) : (
                  <></>
                )}
                <Form.Item
                  name="newPassword"
                  label={t('profile.new_pass')}
                  rules={[
                    {
                      required: true,
                      message: t('validate.new_pass'),
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="New Password"
                    className="register-input"
                  />
                </Form.Item>

                <Form.Item
                  label={t('profile.confirm_pass')}
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: t('validate.confirm_pass'),
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
                      padding: "5px 10px"
                    }}
                  >
                    {t('button.save')}
                  </Button>
                  <Button
                    color="default"
                    variant="solid"
                    type="default"
                    onClick={() => {
                      setView("profile");
                    }}
                    style={{ height: "auto", fontSize: "16px", padding: "5px 10px" }}
                  >
                    {t('button.cancel')}
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
