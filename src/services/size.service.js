import axios from "axios"
import { API_PATH } from "../config/api.config"
import { SIZE_URL } from "../config/url.config"
import { MESSAGE } from "../config/message.config"

export const getListPantShirtSize = (setSize) => {
    axios.get(API_PATH.pantShirtSize)
        .then((res) => {
            setSize(res.data)
            console.log(res.data);
        })
        .catch(error => console.error(error))
}

export const getPantShirtSize = (id, dayjs, form) => {
    axios.get(API_PATH.pantShirtSize + `/${id}`)
        .then((res) => {
            const date = dayjs(res.data.expired_at);
            form.setFieldsValue({
                percent: res.data.percent,
                date: date,
            });
        })
}

export const createPantShirtSize = (size, navigate) => {
    axios.post(API_PATH.pantShirtSize, size)
        .then(
            navigate(SIZE_URL.PANTSHIRT_INDEX, {
                state: { message: MESSAGE.CREATE_SUCCESS }
            })
        )
        .catch(error => {
            console.log(error)
        })
}

export const editPantShirtSize = (id, size, navigate) => {
    axios.put(API_PATH.pantShirtSize + `/${id}`, size)
        .then(
            navigate(SIZE_URL.PANTSHIRT_INDEX, {
                state: { message: MESSAGE.UPDATE_SUCCESS }
            })
        )
        .catch(error => {
            console.log(error)
        })
}

export const getListShoesSize = (setSize) => {
    axios.get(API_PATH.shoesSize)
        .then((res) => {
            setSize(res.data)
            console.log(res.data);
        })
        .catch(error => console.error(error))
}

export const getShoesSize = (id, dayjs, form) => {
    axios.get(API_PATH.shoesSize + `/${id}`)
        .then((res) => {
            const date = dayjs(res.data.expired_at);
            form.setFieldsValue({
                percent: res.data.percent,
                date: date,
            });
        })
}

export const createShoesSize = (size, navigate) => {
    axios.post(API_PATH.shoesSize, size)
        .then(
            navigate(SIZE_URL.SHOES_INDEX, {
                state: { message: MESSAGE.CREATE_SUCCESS }
            })
        )
        .catch(error => {
            console.log(error)
        })
}

export const editShoesSize = (id, size, navigate) => {
    axios.put(API_PATH.shoesSize + `/${id}`, size)
        .then(
            navigate(SIZE_URL.SHOES_INDEX, {
                state: { message: MESSAGE.UPDATE_SUCCESS }
            })
        )
        .catch(error => {
            console.log(error)
        })
}


