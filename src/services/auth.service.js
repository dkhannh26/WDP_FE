import axios from "axios";
import { PATH } from "../config/api.config";

export const googleAuth = (token) => {
  return axios
    .post(PATH.profile + `/google-auth`, { token })
    .then((res) => {
      //   console.log(res.data);
      return res.data;
    })
    .catch((error) => console.error(error));
};
