import axios from "axios";
import { API_PATH } from "../config/api.config";
import { MESSAGE } from "../config/message.config";
import { IMPORT_URL } from "../config/url.config";

export const getListImport = (setImports) => {
  axios
    .get(API_PATH.import + `/list`)
    .then((res) => {
      setImports(
        res.data.map((item, index) => ({
          ...item,
          key: index,
        }))
      );
    })
    .catch((error) => console.error(error));
};

export const createImport = (importList) => {
  axios
    .post(API_PATH.import + `/createDetail`, importList)
    .then((res) => {
      if (res.data.status === "ok") {
        alert("Add to import successfully ");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getDetailImport = (setImportDetail, _id) => {
  axios.get(API_PATH.import + `/${_id}`).then((res) => {
    res.data.forEach((e) => {
      console.log(e);
    });
    setImportDetail(
      res.data.map((item, index) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        key: index,
      }))
    );
  });
};

export const confirmImport = (_id, navigate) => {
  let token = localStorage.getItem("token");
  console.log(token);

  axios
    .put(
      API_PATH.import + `/${_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(
      navigate(IMPORT_URL.INDEX, {
        state: { message: MESSAGE.UPDATE_SUCCESS },
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const downloadTemplate = async () => {
  try {
    const response = await axios.get(API_PATH.import + `/download`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "example-import.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Lỗi khi tải file:", error);
  }
};
