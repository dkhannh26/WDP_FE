import axios from "axios"
import { API_PATH } from "../config/api.config"
import { ORDER_URL } from "../config/url.config"
import { MESSAGE } from "../config/message.config"

export const getListOrder = (setOrders) => {
    axios.get(API_PATH.order)
        .then((res) => {
            setOrders(res.data)
        })
        .catch(error => console.error(error))
}

export const getOrder = (id, form) => {
    axios.get(API_PATH.order + `/${id}`)
        .then((res) => {
            form.setFieldsValue({
                percent: res.data.percent,
            });
        })
}

export const createOrder = (order, navigate) => {
    axios.post(API_PATH.order, order)
        .then(
            navigate(ORDER_URL.CUSTOMER, {
                state: { message: MESSAGE.CREATE_SUCCESS }
            })
        )
        .catch(error => {
            console.log(error)
        })
}

export const editOrder = (id, order, navigate) => {
    axios.put(API_PATH.order + `/${id}`, order)
        .then(
            navigate(ORDER_URL.INDEX, {
                state: { message: MESSAGE.UPDATE_SUCCESS }
            })
        )
        .catch(error => {
            console.log(error)
        })
}

export const getOrderDetails = (id, setOrderDetails) => {
    return axios.get(API_PATH.orderDetails + `/${id}`)
        .then((res) => {
            setOrderDetails(res.data);
            return res.data;
        })
        .catch(error => console.error(error));
};

export const confirmOrder = (id, messageApi, getListOrder, setOrders, orderDetails) => {
    const quantities = orderDetails.map(detail => detail.quantity);
    const pant_shirt_size_detail_id = orderDetails.map(detail => detail.pant_shirt_size_detail_id);
    const shoes_size_detail_id = orderDetails.map(detail => detail.shoes_size_detail_id);
    const accessory_id = orderDetails.map(detail => detail.accessory_id);

    const updateData = {
        quantities,
        pant_shirt_size_detail_id,
        shoes_size_detail_id,
        accessory_id
    };

    axios.put(API_PATH.confirmOrder + `/${id}`, { updateData })
        .then(() => {
            success('Confirm Successfully', messageApi);
            return getListOrder(setOrders);
        })
        .catch(error => {
            console.error(error);
        });
};

export const cancelOrder = (id, messageApi, getListOrder, setOrders) => {
    axios.put(API_PATH.cancelOrder + `/${id}`)
        .then(() => {
            success('Cancel Succesfully', messageApi)
        })
        .then(() => {
            getListOrder(setOrders)
        })
        .catch(error => console.error(error))
}

export const shippedOrder = (id, messageApi, getListOrder, setOrders) => {
    axios.put(API_PATH.shippedOrder + `/${id}`)
        .then(() => {
            success('Cancel Succesfully', messageApi)
        })
        .then(() => {
            getListOrder(setOrders)
        })
        .catch(error => console.error(error))
}

export const getListPendingOrder = (id, setOrderDetails) => {
    axios.get(API_PATH.pendingOrder + `/${id}`)
        .then((res) => {
            setOrderDetails(res.data);
        })
        .catch(error => console.error(error))
}

export const getListDoneOrder = (id, setOrderDetails) => {
    axios.get(API_PATH.doneOrder + `/${id}`)
        .then((res) => {
            setOrderDetails(res.data);
        })
        .catch(error => console.error(error))
}

export const success = (message, messageApi) => {
    messageApi.open({
        type: 'success',
        content: message,
    });
};