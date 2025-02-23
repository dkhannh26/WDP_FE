import axios from "axios";
import { API_PATH } from "../config/api.config";

export const getListFeedback = (id, setFeedback) => {
  axios
    .get(API_PATH.feedback + `/${id}`)
    .then((res) => {
      setFeedback(res.data);
      // console.log(res.data);
    })
    .catch((error) => console.error(error));
};

export const getFeedBack = () => {
  axios
    .get(API_PATH.feedback)
    .then((res) => {})
    .catch((error) => console.error(error));
};

export const createFeedback = (discount) => {
  axios
    .post(API_PATH.feedback, discount)
    .then((res) => {
      // console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateFeedback = (id, discount) => {
  axios
    .put(API_PATH.feedback + `/${id}`, discount)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const likeFeedback = (id, account_id) => {
  axios
    .put(API_PATH.feedback + `/like/${id}`, { account_id })
    .then((res) => {
      return res.data.liked;
      // console.log(res.data.liked);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFeedbackLike = (account_id) => {
  return axios
    .get(API_PATH.feedback + `/like/${account_id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
