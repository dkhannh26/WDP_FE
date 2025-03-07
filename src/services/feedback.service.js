import axios from "axios";
import { API_PATH } from "../config/api.config";

export const getListFeedback = (id, setFeedback) => {
  axios
    .get(API_PATH.feedback + `/${id}`)
    .then((res) => {
      setFeedback(res.data);
      console.log(res.data);
    })
    .catch((error) => console.error(error));
};

export const createFeedback = async (feedback, fileList) => {
  try {
    const feedbackResponse = await axios.post(API_PATH.feedback, feedback);
    const feedbackId = feedbackResponse.data;

    // Upload file nếu có fileList
    if (fileList && fileList.length > 0) {
      const uploadResponse = await axios.post(
        `${API_PATH.feedback}/upload/${feedbackId}`,
        fileList,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrls = uploadResponse.data.imageUrls || [];
      return { imageUrls };
    }

    // Nếu không có file upload thì trả về mảng rỗng
    return { imageUrls: [] };
  } catch (error) {
    console.log(error);
  }
};

export const updateFeedback = async (id, feedback, fileList) => {
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

    const updateRes = await axios.put(`${API_PATH.feedback}/${id}`, feedback);
    const feedbackId = updateRes.data;
    let imageUrls = [];

    if (imgArrResult.length > 0) {
      const uploadRes = await axios.post(
        `${API_PATH.feedback}/upload/${feedbackId}`,
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

export const likeFeedback = (id, account_id) => {
  axios
    .put(API_PATH.feedback + `/like/${id}`, { account_id })
    .then((res) => {
      return res.data.liked;
      // console.log(res.data.liked);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFeedbackLike = (account_id) => {
  return axios
    .get(API_PATH.feedback + `/like/${account_id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFeedbackImg = async (id) => {
  try {
    const res = await axios.get(API_PATH.feedback + `/image/${id}`);

    const imageUrls = res.data;
    console.log(imageUrls);

    const fileList = imageUrls.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}.jpg`,
      status: "done",
      url: `http://localhost:3000${url}`,
    }));
    return fileList;
  } catch (error) {
    console.log(error);
  }
};
