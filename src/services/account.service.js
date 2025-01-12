import axios from "axios";
import { API_PATH } from "../config/api.config";
import { ACCOUNT_URL, DISCOUNT_URL } from "../config/url.config";
import { MESSAGE } from "../config/message.config";
import Password from "antd/es/input/Password";

export const getListAccount = (setAccounts) => {
  axios
    .get(API_PATH.account + `/list`)
    .then((res) => {
      setAccounts(
        res.data.list.map((account, index) => ({
          ...account,
          key: index,
          deleted: JSON.stringify(account.deleted),
        }))
      );
    })
    .catch((error) => console.error(error));
};

export const getAccount = (id, form) => {
  axios.get(API_PATH.account + `/${id}`).then((res) => {
    const data = res.data.user;

    form.setFieldsValue({
      username: data.username,
      email: data.email,
      address: data.address,
      phone: data.phone,
      password: "",
      deleted: JSON.stringify(data.deleted),
    });
  });
};

export const createAccount = (account, navigate) => {
  axios
    .post(API_PATH.account + `/create`, account)
    .then((res) => {
      if (res.data.success) {
        navigate(ACCOUNT_URL.INDEX, {
          state: { message: MESSAGE.CREATE_SUCCESS },
        });
      } else {
        alert(res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const editAccount = (id, account, navigate) => {
  axios
    .put(API_PATH.account + `/${id}`, account)
    .then((res) => {
      if (res.data.success) {
        navigate(ACCOUNT_URL.INDEX, {
          state: { message: MESSAGE.UPDATE_SUCCESS },
        });
      } else {
        alert(res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
