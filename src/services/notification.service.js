import axios from "axios";
import { API_PATH } from "../config/api.config";

export const getListNotifications = async (setNotifications, setCount, id) => {
  try {
    await axios
      .get(`${API_PATH.notification}/get-notification/${id}`)
      .then((res) => {
        const notis = res.data.notifications.map((notif, index) => {
          const date = new Date(notif.createdAt);
          const formattedDate = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
          console.log();

          return {
            key: index + 1,
            label: notif.message,
            url: "admin/racket/detail/" + notif.url.split("/")[2],
            created_at: formattedDate,
          };
        });

        setNotifications(notis);
        setCount(res.data.countNotification);
      });
  } catch (error) {
    console.log(error);
  }
};

export const readNotification = async (id) => {
  try {
    await axios
      .put(`${API_PATH.notification}/read-notification/${id}`)
      .then((res) => {
        // setCount(res.data);
      });
  } catch (error) {
    console.log(error);
  }
};
