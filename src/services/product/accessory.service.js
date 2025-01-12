import axios from "axios"
import { API_PATH } from "../../config/api.config"
import { ACCESSORY_URL } from "../../config/url.config"
import { MESSAGE } from "../../config/message.config"

export const getListAccessory = (setAccessories) => {
  axios.get(API_PATH.accessory)
    .then((res) => {
      setAccessories(res.data.data)
    })
    .catch(error => console.error(error))
}

export const getAccessoryCustomer = (id, setAccessory, setImages, setCanvas, setQuantity) => {
  axios.get(API_PATH.accessory + `/${id}`)
    .then((res) => {
      setAccessory(res.data)

      console.log(res.data)
      const images = res.data?.images
      let imgArrResult = []

      if (images) {
        for (let img of images) {
          imgArrResult.push({
            url: `${API_PATH.image}/${img.accessory_id}/${img.img_id}${img.file_extension}`,
          })
        }
      }
      if (imgArrResult[0]) {
        setCanvas(imgArrResult[0]?.url)
      }
      setImages(imgArrResult)
      setQuantity(res.data.quantity)
      // selectSize(Object.keys(res.data.size[0])[0], Object.values(res.data.size[0])[0])
    }
    )
}

export const getListAccessoryIncrease = (setAccessories) => {
  axios.get(API_PATH.accessory + '/increase')
    .then((res) => {
      setAccessories(res.data.data)
    })
    .catch(error => console.error(error))
}

export const getListAccessoryDecrease = (setAccessories) => {
  axios.get(API_PATH.accessory + '/decrease')
    .then((res) => {
      setAccessories(res.data.data)
    })
    .catch(error => console.error(error))
}

export const getAccessory = (id, form, handleFileListChange) => {
  axios.get(API_PATH.accessory + `/${id}`)
    .then((res) => {
      const images = res.data?.images
      let imgArrResult = []
      if (images) {
        for (let img of images) {
          imgArrResult.push({
            uid: img.img_id,
            name: 'image.png',
            status: 'done',
            url: `${API_PATH.image}/${img.accessory_id}/${img.img_id}${img.file_extension}`,
          })
        }
        handleFileListChange(imgArrResult)
      }

      form.setFieldsValue({
        discount: res.data?.discount?.discount_id,
        name: res.data.name,
        quantity: res.data.quantity,
        price: res.data.price,
      });
    })
}

export const createAccessory = (accessory, fileList, navigate) => {
  axios.post(API_PATH.accessory, accessory)
    .then(res => {
      axios.post(API_PATH.accessory + `/upload/${res.data}`, fileList, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    })
    .then(
      navigate(ACCESSORY_URL.INDEX, {
        state: { message: MESSAGE.CREATE_SUCCESS }
      })
    )
    .catch(error => {
      console.log(error)
    })
}

export const editAccessory = (id, accessory, fileList, navigate) => {
  let imgArrResult = []
  if (fileList) { // xư lý các hình có sẵn trong antd để chuyển thành dạng file
    for (let img of fileList) {
      // console.log(img)
      if (img.url) {
        fetch(img?.url)
          .then(response => response.blob())  // Chuyển phản hồi thành Blob
          .then(blob => {
            const file = new File([blob], img.name, { type: blob.type });
            imgArrResult.push(file)

          })
          .catch(error => console.error('Error:', error));
      } else {
        imgArrResult.push(img)
      }
    }
  }

  axios.put(API_PATH.accessory + `/${id}`, accessory)
    .then(
      res => {
        axios.post(API_PATH.accessory + `/upload/${res.data}`, imgArrResult, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(
            navigate(ACCESSORY_URL.INDEX, {
              state: { message: MESSAGE.UPDATE_SUCCESS }
            })
          )
      }

    )
    .catch(error => {
      console.log(error)
    })
}