import axios from "axios"
import { API_PATH } from "../config/api.config"
import { ORDER_URL } from "../config/url.config"
import { MESSAGE } from "../config/message.config"

export const getListOrder = (setOrders, setFilteredOrders) => {
    axios.get(API_PATH.order)
        .then((res) => {
            setOrders(res.data)
            setFilteredOrders(res.data)
        })
        .catch(error => console.error(error))
}
export const getListRefund = (setOrders, setFilteredOrders) => {
    axios.get(API_PATH.allRefund)
        .then((res) => {
            setOrders(res.data)
            setFilteredOrders(res.data)
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

export const createOrder = async (order, navigate) => {
    try {
        await axios.post(API_PATH.order, order)
        const emailData = {
            to: order.email,
            subject: 'Xác nhận đơn hàng',
            body: `Cảm ơn bạn đã đặt hàng. Xin hãy kiểm tra đơn hàng của bạn và phản hồi với chúng tôi nêu xảy ra vấn đề!`
        };

        const emailAdmin = {
            to: 'nguyenthanhson.19102003@gmail.com',
            subject: 'Có Đơn Hàng Cần Xác Nhận',
            body: `Đơn hàng của khách hàng ${order.name} đang đợi xác nhận!!!`
        }

        axios.post(API_PATH.sms, emailData);
        axios.post(API_PATH.sms, emailAdmin);

        navigate(ORDER_URL.CUSTOMER, {
            state: { message: MESSAGE.CREATE_SUCCESS }
        });
    } catch (error) {
        console.error('Error:', error);
    }
};
export const paidOrder = async (order, navigate) => {
    try {
        await axios.post(API_PATH.paidOrder, order)
        const emailData = {
            to: order.email,
            subject: 'Xác nhận đơn hàng',
            body: `Cảm ơn bạn đã đặt hàng. Xin hãy kiểm tra đơn hàng của bạn và phản hồi với chúng tôi nêu xảy ra vấn đề!`
        };

        const emailAdmin = {
            to: 'nguyenthanhson.19102003@gmail.com',
            subject: 'Có Đơn Hàng Cần Xác Nhận',
            body: `Đơn hàng của khách hàng ${order.name} đang đợi xác nhận!!!`
        }

        axios.post(API_PATH.sms, emailData);
        axios.post(API_PATH.sms, emailAdmin);

        navigate(ORDER_URL.CUSTOMER, {
            state: { message: MESSAGE.CREATE_SUCCESS }
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

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
            setOrderDetails(res.data.data);
            console.log(res.data.data);
            return res.data;
        })
        .catch(error => console.error(error));
};

export const confirmOrder = (id, messageApi, getListOrder, setOrders, setFilteredOrders, orderDetails, confirmUser) => {
    const quantities = orderDetails.data?.map(detail => detail.cartQuantity);
    const product_size_id = orderDetails.data?.map(detail => detail.product_size_id);
    const confirm_user_id = confirmUser;
    const updateData = {
        quantities,
        product_size_id,
        confirm_user_id,
    };

    axios.put(API_PATH.confirmOrder + `/${id}`, { updateData })
        .then(() => {
            success('Confirm Successfully', messageApi);
            return getListOrder(setOrders, setFilteredOrders);
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.message) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error('Failed to confirm order');
            }
        });
};
export const confirmRefund = (id, messageApi, getlistRefund, setOrders, setFilteredOrders, orderDetails, confirmUser) => {
    const quantities = orderDetails.data?.map(detail => detail.cartQuantity);
    const product_size_id = orderDetails.data?.map(detail => detail.product_size_id);
    const confirm_user_id = confirmUser;
    const updateData = {
        quantities,
        product_size_id,
        confirm_user_id,
    };

    axios.put(API_PATH.confirmRefund + `/${id}`, { updateData })
        .then(() => {
            success('Confirm Successfully', messageApi);
            return getlistRefund(setOrders, setFilteredOrders);
        })
        .catch(error => {
            console.error(error);
        });
};

export const cancelOrder = (id, messageApi, getListOrder, setOrders, setFilteredOrders) => {
    axios.put(API_PATH.cancelOrder + `/${id}`)
        .then(() => {
            success('Cancel Successfully', messageApi);
            return getListOrder(setOrders, setFilteredOrders);
        })
        .catch(error => console.error(error))
}

export const shippedOrder = (id, messageApi, getListOrder, setOrders, setFilteredOrders) => {
    axios.put(API_PATH.shippedOrder + `/${id}`)
        .then(() => {
            success('Cancel Succesfully', messageApi)
        })
        .then(() => {
            getListOrder(setOrders, setFilteredOrders)

        })
        .catch(error => console.error(error))
}
export const refundOrder = (id, messageApi, getListOrder, setOrders, setFilteredOrders) => {
    axios.put(API_PATH.refundOrder + `/${id}`)
        .then(() => {
            success('Refund Successfully', messageApi);
            return getListOrder(setOrders, setFilteredOrders);
        })
        .catch(error => console.error(error))
}
export const refundReject = (id, messageApi, getListOrder, setOrders, setFilteredOrders) => {
    axios.put(API_PATH.rejectRefund + `/${id}`)
        .then(() => {
            success('Reject Successfully', messageApi);
            return getListOrder(setOrders, setFilteredOrders);
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

export const getListDoneOrder = (id, setOrders) => {
    axios.get(API_PATH.doneOrder + `/${id}`)
        .then((res) => {
            setOrders(res.data);
        })
        .catch(error => console.error(error))
}

export const success = (message, messageApi) => {
    messageApi.open({
        type: 'success',
        content: message,
    });
};

export const getTop10 = (setTop10) => {
    axios.get(API_PATH.hotProduct)
        .then((res) => {
            setTop10(res.data.data)
        })
        .catch(error => console.error(error))
}

export const getHotBrand = (setHotBrands) => {
    axios.get(API_PATH.hotBrand)
        .then((res) => {
            setHotBrands(res.data.data)
        })
        .catch(error => console.error(error))
}

export const getListOrderDetail = (id, setOrderDetails) => {
    axios.get(API_PATH.allDetail + `/${id}`)
        .then((res) => {
            setOrderDetails(res.data)
        })
        .catch(error => console.error(error))
}
export const getListTransOrder = (id, setOrders) => {
    axios.get(API_PATH.transitOrder + `/${id}`)
        .then((res) => {
            setOrders(res.data);
        })
        .catch(error => console.error(error))
}
export const getListCancelOrder = (id, setOrders) => {
    axios.get(API_PATH.cancelOrder + `/${id}`)
        .then((res) => {
            setOrders(res.data);
        })
        .catch(error => console.error(error))
}
export const getAllOrder = (id, setOrders) => {
    axios.get(API_PATH.allOrderCustomer + `/${id}`)
        .then((res) => {
            setOrders(res.data);
        })
        .catch(error => console.error(error))
}
export const getListRefundOrder = (id, setOrders) => {
    axios.get(API_PATH.refundOrder + `/${id}`)
        .then((res) => {
            setOrders(res.data);
        })
        .catch(error => console.error(error))
}
export const updateOrder = async (id, order, fileList) => {
    try {
        let imgArrResult = [];
        if (fileList && fileList.length > 0) {
            for (let img of fileList) {
                if (img.url) {
                    // Nếu là ảnh cũ (có URL), fetch và chuyển thành File
                    const response = await fetch(img.url);
                    const blob = await response.blob();
                    const file = new File([blob], img.name, { type: blob.type });
                    imgArrResult.push(file);
                } else {
                    // Nếu là ảnh mới, thêm trực tiếp (originFileObj từ Ant Design Upload)
                    imgArrResult.push(img.originFileObj || img);
                }
            }
        }

        const updateRes = await axios.put(`${API_PATH.order}/${id}`, order);
        const orderId = updateRes.data._id;
        let imageUrls = [];

        if (imgArrResult.length > 0) {
            const uploadRes = await axios.post(
                `${API_PATH.order}/upload/${orderId}`,
                imgArrResult,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            imageUrls = uploadRes.data.imageUrls || [];
        }

        return { imageUrls };
    } catch (error) {
        console.log(error);
    }
};