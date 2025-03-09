import axios from "axios";
import { API_PATH } from "../config/api.config";
import { BRAND_URL } from "../config/url.config";
import { MESSAGE } from "../config/message.config";

export const getListBrand = (setBrands) => {
  axios
    .get(API_PATH.brand)
    .then((res) => {
      setBrands(res.data);
    })
    .catch((error) => console.error(error));
};
export const getListFilter = (setBrands, setFilteredBrands) => {
  axios.get(API_PATH.brand)
    .then((res) => {
      setBrands(res.data)
      setFilteredBrands(res.data)
    })
    .catch(error => console.error(error))
}
export const getBrand = (id, form) => {
  axios.get(API_PATH.brand + `/${id}`).then((res) => {
    form.setFieldsValue({
      name: res.data.name,
    });
  });
};

export const createBrand = (brand, navigate) => {
  axios
    .post(API_PATH.brand, brand)
    .then(
      navigate(BRAND_URL.INDEX, {
        state: { message: MESSAGE.CREATE_SUCCESS },
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const editBrand = (id, brand, navigate) => {
  axios
    .put(API_PATH.brand + `/${id}`, brand)
    .then(
      navigate(BRAND_URL.INDEX, {
        state: { message: MESSAGE.UPDATE_SUCCESS },
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
export const deleteBrand = (id) => {
  axios.delete(API_PATH.brand + `/${id}`)
    .then((res) => {
      console.log(res.data);
    })
    .catch(error => {
      console.log(error);
    })
}