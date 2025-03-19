import axios from "axios";
import React, { useRef, useState } from "react";
import { PATH } from "../config/api.config";

import { GoogleLogin } from "@react-oauth/google";
import { Button, Carousel, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../services/auth.service";
import { useAuth } from "./context/AuthContext";
import ForgotPassword from "./forgotPassword";
const LoginPopover = () => {
  const navigate = useNavigate();
  const [username, setUsernameState] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated, setUsername, user, setUser } =
    useAuth(); // Get authentication state and functions

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let res = axios
        .post(`${PATH.login}`, {
          username,
          password,
        })
        .then((res) => {
          console.log(res.data);
          if (res && res.data.EC === 0) {
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("permissions", JSON.stringify(res.data.permissions));


            setIsAuthenticated(true);
            // setUsername(res);
            notification.success({
              message: res.data.message,
              description: "success",
            });
            setUsernameState("");
            setPassword("");

            setTimeout(() => {
              navigate("/customer/profile");
            }, 1000);
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

  const carouselRef = useRef(null);

  const handleError = () => {
    alert("Login failed");
  };

  const handleSuccess = async (response) => {
    try {
      let data = await googleAuth(response.credential);

      if (data && data.EC === 0) {
        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.token);

        setIsAuthenticated(true);
        // setUsername(res);
        notification.success({
          message: data.message,
          description: "success",
        });
        setUsernameState("");
        setPassword("");

        setTimeout(() => {
          navigate("/customer/profile");
        }, 1000);
      } else {
        alert("Your email already exists in the system");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <Carousel ref={carouselRef} dots={false} style={{ width: 350 }}>
          <form className="login-pop" onSubmit={onSubmit}>
            <div className="login-pop-title">
              <p className="login-pop-title__1">Đăng nhập tài khoản</p>
              <p className="login-pop-title__2 text">
                Nhập email và mật khẩu của bạn:
              </p>
            </div>
            <div className="login-pop-input">
              <input
                name="email"
                value={username}
                onChange={(e) => setUsernameState(e.target.value)}
                required
              />
              <label className="text">Username</label>
            </div>
            <div className="login-pop-input">
              <input
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
              <label className="text">Password</label>
            </div>
            <div className="login-pop-recaptcha">
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
            <button type="submit" className="login-pop-btn">
              ĐĂNG NHẬP
            </button>
            <div className="or-divider">
              <span>Hoặc</span>
            </div>

            {/* <button className="login-pop-btn">ĐĂNG NHẬP VỚI GOOGLE</button> */}

            <div className="google-button-container">
              <GoogleLogin
                size="large"
                theme="filled_black"
                text="signin_with"
                shape="rectangular"
                width="346px"
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
            <div className="login-pop-navigate text">
              <p>
                Khách hàng mới?
                <a href="/customer/register"> Tạo tài khoản</a>
              </p>
              <p>
                Quên mật khẩu?
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    carouselRef.current.next();
                  }}
                >
                  {" "}
                  Khôi phục mật khẩu
                </a>
              </p>
            </div>
          </form>
          <ForgotPassword carouselRef={carouselRef} />
        </Carousel>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 130,
            alignItems: "flex-start",
          }}
        >
          <Button
            className="pop-list-item"
            style={{ marginBottom: 8, border: "none" }}
            onClick={() => {
              navigate("/customer/profile", { state: { view: "profile" } });
            }}
          >
            My Profile
          </Button>
          <Button
            className="pop-list-item"
            style={{ marginBottom: 8, border: "none" }}
            onClick={() => {
              navigate("/customer/profile", { state: { view: "change" } });
            }}
          >
            Change Password
          </Button>
          <Button
            className="pop-list-item"
            style={{ marginBottom: 8, border: "none" }}
            onClick={() => {
              localStorage.clear("token");
              setIsAuthenticated(false);
              setUsername("");
              setUser("");
              navigate("/customer");
            }}
          >
            Logout
          </Button>
        </div>
      )}
    </>
  );
};

export default LoginPopover;
