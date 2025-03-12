import axios from "axios";
import { API_PATH } from "../config/api.config";
import { WISHLIST_URL } from "../config/url.config";
import { MESSAGE } from "../config/message.config";

export const getListWishlist = (id, setWishlists) => {
  axios
    .get(API_PATH.wishlist + `/${id}`)
    .then((res) => {
      console.log(res.data.data);
      setWishlists(res.data.data);
    })
    .catch((error) => console.error(error));
};

export const getWishlist = (id, dayjs, form) => {
  axios.get(API_PATH.wishlist + `/${id}`).then((res) => {
    const date = dayjs(res.data.expired_at);
    form.setFieldsValue({
      percent: res.data.percent,
      date: date,
    });
  });
};

export const createWishlist = (wishlist) => {
  axios
    .post(API_PATH.wishlist, wishlist)
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const editWishlist = (id, wishlist, navigate) => {
  axios
    .put(API_PATH.wishlist + `/${id}`, wishlist)
    .then(
      navigate(WISHLIST_URL.INDEX, {
        state: { message: MESSAGE.UPDATE_SUCCESS },
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
export const checkWishlist = (userId, productId) => {
  return axios.get(`${API_PATH.wishlist}/check?userId=${userId}&productId=${productId}`);
};

