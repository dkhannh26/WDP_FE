import axios from "axios";
import { API_PATH } from "../config/api.config";
import { DISCOUNT_URL } from "../config/url.config";
import { MESSAGE } from "../config/message.config";

export const getListDiscount = (setDiscounts) => {
  axios
    .get(API_PATH.discount)
    .then((res) => {
      setDiscounts(res.data);
    })
    .catch((error) => console.error(error));
};

export const getDiscount = (id, dayjs, form) => {
  axios.get(API_PATH.discount + `/${id}`).then((res) => {
    const date = dayjs(res.data.expired_at);
    form.setFieldsValue({
      percent: res.data.percent,
      date: date,
    });
  });
};

export const createDiscount = (discount, navigate) => {
  axios
    .post(API_PATH.discount, discount)
    .then(
      navigate(DISCOUNT_URL.INDEX, {
        state: { message: MESSAGE.CREATE_SUCCESS },
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const editDiscount = (id, discount, navigate) => {
  axios
    .put(API_PATH.discount + `/${id}`, discount)
    .then(
      navigate(DISCOUNT_URL.INDEX, {
        state: { message: MESSAGE.UPDATE_SUCCESS },
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
