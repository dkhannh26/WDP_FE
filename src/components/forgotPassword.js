import React, { useState } from "react";
import axios from "axios";
import { PATH } from "../config/api.config";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ carouselRef }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const navigate = useNavigate();

  const [showCodeInput, setShowCodeInput] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!showCodeInput) {
        axios.post(PATH.forgotPassword, { email }).then((res) => {
          if (res.data.success) {
            notification.success({
              message: res.data.message,
              description: "success",
            });

            localStorage.setItem("token", res.data.token);
            setShowCodeInput(true);
            setReadOnly(true);
          } else {
            notification.error({
              message: res.data.message,
              description: "error",
            });
          }
        });
      } else {
        const token = localStorage.getItem("token");

        axios.post(PATH.forgotPassword, { code, token }).then((res) => {
          if (res.data.success) {
            notification.success({
              message: res.data.message,
              description: "success",
            });

            navigate(`/customer/reset-password/${res.data.newToken}`);
          } else {
            notification.error({
              message: res.data.message,
              description: "error",
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="login-pop-title">
        <p className="login-pop-title__1">KHÔI PHỤC MẬT KHẨU</p>
        <p className="login-pop-title__2 text">Nhập email của bạn:</p>
      </div>
      <div className="login-pop-input">
        <input
          readOnly={readOnly}
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="text">Email</label>
      </div>

      {showCodeInput && (
        <div className="login-pop-input">
          <input
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <label className="text">Code</label>
        </div>
      )}
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
      <button type="submit" className="re-pass-btn">
        KHÔI PHỤC
      </button>
      <div className="login-pop-navigate text">
        <p>
          Bạn đã nhớ mật khẩu?
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              carouselRef.current.prev();
            }}
          >
            {" "}
            Trở về đăng nhập
          </a>
        </p>
      </div>
    </form>
  );
};

ForgotPassword.propTypes = {};

export default ForgotPassword;