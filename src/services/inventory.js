import axios from "axios";
import { API_PATH } from "../config/api.config";

export const getListInventory = (setInventory) => {
    axios
        .get(API_PATH.inventory)
        .then((res) => {
            // console.log('res' + JSON.stringify(res.data));
            setInventory(res.data)
        })
        .catch((error) => console.error(error));
};