import axios from "axios";
import { API_PATH } from "../config/api.config";
import { MESSAGE } from "../config/message.config";
import { message } from 'antd';
export const success = (message, messageApi) => {
    messageApi.open({
        type: 'success',
        content: message,
    });
};

export const updatePermission = (permissions, role) => {
    axios.put(API_PATH.permission, {
        permissions,
        role
    })
        .then(() => {
            message.success(MESSAGE.UPDATE_SUCCESS);
        })
        .catch(error => console.error(error))
}

export const getPermissionsByRole = async (role) => {
    const response = await axios.get(API_PATH.permission, {
        params: { role: role }
    })
    return response.data;
};