import axios from "axios"
import { API_PATH } from "../config/api.config"
import { VOUCHER_URL } from "../config/url.config"
import { MESSAGE } from "../config/message.config"

export const getListVoucher = (setVouchers) => {
    axios.get(API_PATH.voucher)
        .then((res) => {
            setVouchers(res.data)
        })
        .catch(error => console.error(error))
}

export const getVoucher = (id, form) => {
    axios.get(API_PATH.voucher + `/${id}`)
        .then((res) => {
            form.setFieldsValue({
                condition: res.data.condition,
                percent: res.data.percent
            });
        })
}

export const createVoucher = (voucher, navigate) => {
    axios.post(API_PATH.voucher, voucher)
        .then(
            navigate(VOUCHER_URL.INDEX, {
                state: { message: MESSAGE.CREATE_SUCCESS }
            })
        )
        .catch(error => {
            console.log(error)
        })
}

export const editVoucher = (id, voucher, navigate) => {
    axios.put(API_PATH.voucher + `/${id}`, voucher)
        .then(
            navigate(VOUCHER_URL.INDEX, {
                state: { message: MESSAGE.UPDATE_SUCCESS }
            })
        )
        .catch(error => {
            console.log(error)
        })
}