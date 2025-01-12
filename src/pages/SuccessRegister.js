import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PATH } from "../config/api.config";
import axios from "axios";
import { Button, Result } from "antd";
// import "../assets/css/register.success.css";
import { useAuth } from "../components/context/AuthContext";

const SuccessRegister = (path) => {
  const { token, id } = useParams();
  // console.log(id);
  const {
    setIsAuthenticated,
  } = useAuth();
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // account/update/:accountId/:token

          await axios
            .put(`${PATH.updateProfile}/${id}/${token}`, token)
            .then((res) => {
              console.log(res);
              setIsAuthenticated(true);

              if (res.data.EC === 0) {
                setMessage(res.data.message);
              }
            });
        } else {
          await axios
            .post(`${PATH.register}/${token}`, token)
            .then((res) => {
              if (res.data.EC === 0) {
                setMessage(res.data.message);
              }
            });
        }

        // console.log(res.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Result
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
      status="success"
      title={message}
      subTitle=""
      extra={[
        <Button href="/customer" type="primary" key="console">
          Back to home page
        </Button>,
        // <Button key="buy">Close this page</Button>,
      ]}
    />
  );
};

SuccessRegister.propTypes = {};

export default SuccessRegister;
