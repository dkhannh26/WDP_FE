import axios from "axios";
import React, { useRef, useState } from "react";
import { PATH } from "../config/api.config";

import { GoogleLogin } from "@react-oauth/google";
import { Button, Carousel, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../services/auth.service";
import { useAuth } from "./context/AuthContext";
import ForgotPassword from "./forgotPassword";
import { t } from "i18next";
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
              <p className="login-pop-title__1">{t('header.login_account')}</p>
              <p className="login-pop-title__2 text">
                {t('header.enter_email_password')}
              </p>
            </div>
            <div className="login-pop-input">
              <input
                name="email"
                value={username}
                onChange={(e) => setUsernameState(e.target.value)}
                required
              />
              <label className="text">{t('username')}</label>
            </div>
            <div className="login-pop-input">
              <input
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
              <label className="text">{t('password')}</label>
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
            <button type="submit" className="login-pop-btn uppercase">
              {t('header.sign_in')}
            </button>
            <div className="or-divider uppercase">
              <span>{t('header.or')}</span>
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
              {t('header.new_customer')}?
                <a href="/customer/register"> {t('header.sign_up')}</a>
              </p>
              <p>
              {t('header.forget_password')}?
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    carouselRef.current.next();
                  }}
                >
                  {" "}
                  {t('header.reset_password')}
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
            {t('header.my_account')}
          </Button>
          <Button
            className="pop-list-item"
            style={{ marginBottom: 8, border: "none" }}
            onClick={() => {
              navigate("/customer/profile", { state: { view: "change" } });
            }}
          >
            {t('profile.change_pass')}
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
            {t('profile.log_out')}
          </Button>
        </div>
      )}
    </>
  );
};

export default LoginPopover;
