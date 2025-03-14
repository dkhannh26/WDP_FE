import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import axios from "axios";
import { API_PATH } from "../config/api.config";
import moment from "moment";
const { confirm } = Modal;

export const showDeleteConfirm = (id, messageApi, getList, setList, URL, typeProduct) => {
  confirm({
    title: 'Are you sure delete?',
    icon: <ExclamationCircleFilled />,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      console.log(URL + `/${id}`);

      axios.delete(URL + `/${id}`)
        .then((response) => {
          const { message } = response.data;
          success(message, messageApi);
        })
        .then(() => {
          getList(setList, typeProduct)
        })
        .catch((error) => {
          if (error.response) {
            const { message } = error.response.data;
            errorMsg(message, messageApi);
          }
          console.error(error);
        })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

export const showDeleteConfirmFilter = (id, messageApi, getList, setList, URL, typeProduct, setListFilter) => {
  confirm({
    title: 'Are you sure delete?',
    icon: <ExclamationCircleFilled />,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      axios.delete(URL + `/${id}`)
        .then((response) => {
          success('Deleted Succesfully', messageApi)
        })
        .then(() => {
          getList(setList, typeProduct, setListFilter)
        })
        .catch((error) => {
          if (error.response) {
            const { message } = error.response.data;
            errorMsg(message, messageApi);
          }
          console.error(error);
        })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

export const success = (message, messageApi) => {
  messageApi.open({
    type: "success",
    content: message,
  });
};
export const errorMsg = (msg, messageApi) => {
  messageApi.open({
    type: 'error',
    content: msg,
  });
};

export const formatDate = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY");
};
export const showDeleteVoucherConfirm = (
  id,
  messageApi,
  getListVoucher,
  setVouchers
) => {
  confirm({
    title: "Are you sure delete this voucher?",
    icon: <ExclamationCircleFilled />,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      axios
        .delete(API_PATH.voucher + `/${id}`)
        .then(() => {
          success("Deleted Succesfully", messageApi);
        })
        .then(() => {
          getListVoucher(setVouchers);
        })
        .catch((error) => console.error(error));
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export const showRecoveryAccount = (
  id,
  messageApi,
  getListAccount,
  setAccount
) => {
  confirm({
    title: "Are you sure recovery this account?",
    icon: <ExclamationCircleFilled />,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      axios
        .post(API_PATH.account + `/recovery/${id}`)
        .then(() => {
          success("Deleted Successfully", messageApi);
        })
        .then(() => {
          getListAccount(setAccount);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export const showDeleteAccountConfirm = (
  id,
  messageApi,
  getListAccount,
  setAccount
) => {
  confirm({
    title: "Are you sure delete this account?",
    icon: <ExclamationCircleFilled />,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      axios
        .delete(API_PATH.account + `/${id}`)
        .then(() => {
          success("Deleted Succesfully", messageApi);
        })
        .then(() => {
          getListAccount(setAccount);
        })
        .catch((error) => console.error(error));
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export const showDeletePermanently = (
  id,
  messageApi,
  getListAccount,
  setAccount
) => {
  confirm({
    title: "Are you sure delete permanently this account?",
    icon: <ExclamationCircleFilled />,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      axios
        .delete(API_PATH.account + `/permanentlyDelete/${id}`)
        .then((res) => {
          console.log(res);

          success("Deleted Successfully", messageApi);
        })
        .then(() => {
          getListAccount(setAccount);
        })
        .catch((error) => console.error(error));
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export const showDeleteImportConfirm = (
  id,
  messageApi,
  getListImport,
  setImports
) => {
  confirm({
    title: "Are you sure delete this import?",
    icon: <ExclamationCircleFilled />,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      axios
        .delete(API_PATH.import + `/${id}`)
        .then(() => {
          success("Deleted Succesfully", messageApi);
        })
        .then(() => {
          getListImport(setImports);
        })
        .catch((error) => console.error(error));
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};
