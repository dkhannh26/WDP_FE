import axios from "axios"
import { API_PATH } from "../config/api.config"


export const createPayment = (amount, bankCode, language, name, address, phone) => {
    axios.post(API_PATH.payment, {
        amount,
        bankCode,
        language,
        name,
        address,
        phone,
    })
        .then(response => {
            window.location.href = response.data;
        })
        .catch(error => {
            console.log(error);
        });
}

export const createPayOS = (amount, bankCode, language, name, address, phone) => {
    axios.post(API_PATH.payOS, {
        amount,
        bankCode,
        language,
        name,
        address,
        phone,
    })
        .then(response => {
            window.location.href = response.data;
        })
        .catch(error => {
            console.log(error);
        });
}
