import axios from "axios";
import { API_PATH } from "../config/api.config";
import { ACCOUNT_URL } from "../config/url.config";
import { MESSAGE } from "../config/message.config";

export const googleAuth = (token) => {
  return axios
    .post(API_PATH.account + `/google-auth`, { token })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((error) => console.error(error));
};
