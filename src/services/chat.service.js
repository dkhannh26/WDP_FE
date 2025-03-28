import axios from "axios";
import { API_PATH } from "../config/api.config";
import { DISCOUNT_URL } from "../config/url.config";
import { MESSAGE } from "../config/message.config";

export const getListNotification = async (id, setChatNotifications, setNotificationCount) => {
    await axios
        .get(API_PATH.unreadNotification + `/${id}`)
        .then((res) => {
            const data = res.data;
            setChatNotifications(data);
            setNotificationCount(data.length);
        })
        .catch((error) => console.error(error));
};

export const readNotification = async (userId, senderId, setNotifications) => {
    try {
        await axios.put(API_PATH.readNotification + `/${userId}` + `/${senderId}`);
        const response = await axios.get(API_PATH.unreadNotification + `/${userId}`);
        setNotifications(response.data);
    } catch (error) {
        console.error("Error marking notifications as read:", error);
    }
};
