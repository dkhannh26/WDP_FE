import axios from "axios";
import { API_PATH } from "../config/api.config";
import { DISCOUNT_URL, IMPORT_URL } from "../config/url.config";
import { MESSAGE } from "../config/message.config";

export const getListImport = (setImports) => {
  axios
    .get(API_PATH.import + `/list`)
    .then((res) => {
      setImports(
        res.data.map((item, index) => ({
          ...item,
          key: index,
        }))
      );
    })
    .catch((error) => console.error(error));
};

export const createImport = (importList, navigate) => {
  axios
    .post(API_PATH.import + `/createDetail`, importList)
    .then(() => {
      navigate(IMPORT_URL.INDEX, {
        state: { message: MESSAGE.CREATE_SUCCESS },
      });
    })
    .catch((error) => {
      if (error.response.status === 400) {
        alert("Wrong product name, please try again");
      }
    });
};

export const getDetailImport = (setImportDetail, _id) => {
  axios.get(API_PATH.import + `/${_id}`).then((res) => {
    res.data.forEach((e) => {
      console.log(e);
    });
    setImportDetail(
      res.data.map((item, index) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        key: index,
      }))
    );
  });
};

export const confirmImport = (_id, navigate) => {
  let token = localStorage.getItem("token");
  console.log(token);

  axios
    .put(
      API_PATH.import + `/${_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(
      navigate(IMPORT_URL.INDEX, {
        state: { message: MESSAGE.UPDATE_SUCCESS },
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
