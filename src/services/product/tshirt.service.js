import axios from "axios"
import { API_PATH } from "../../config/api.config"
import { TSHIRT_URL } from "../../config/url.config"
import { MESSAGE } from "../../config/message.config"

export const getListTshirt = (setTshirts) => {
  axios.get(API_PATH.tshirt)
    .then((res) => {
      setTshirts(res.data.data)
    })
    .catch(error => console.error(error))
}

export const getTshirtCustomer = (id, setTshirt, setImages, setCanvas, selectSize) => {
  axios.get(API_PATH.tshirt + `/${id}`)
    .then((res) => {
      // console.log(res.data)
      setTshirt(res.data)
      const images = res.data?.images
      let imgArrResult = []

      if (images) {
        for (let img of images) {
          imgArrResult.push({
            url: `${API_PATH.image}/${img.tshirt_id}/${img.img_id}${img.file_extension}`,
          })
        }
      }
      if (imgArrResult[0]) {
        setCanvas(imgArrResult[0]?.url)
      }
      setImages(imgArrResult)

      if (res.data.size) {
        selectSize(Object.keys(res.data.size[0])[0], Object.values(res.data.size[0])[0], Object.values(res.data.size[0])[1])
      }
    }
    )
}

export const getListTshirtIncrease = (setTshirtList) => {
  axios.get(API_PATH.tshirt + '/increase')
    .then((res) => {
      setTshirtList(res.data.data)
      console.log('/increase')
    })
    .catch(error => console.error(error))
}

export const getListTshirtDecrease = (setTshirtList) => {
  axios.get(API_PATH.tshirt + '/decrease')
    .then((res) => {
      setTshirtList(res.data.data)
    })
    .catch(error => console.error(error))
}


export const getTshirt = (id, form, handleFileListChange, setError) => {
  axios.get(API_PATH.tshirt + `/${id}`)
    .then((res) => {

      let M, L, S, XL, XXL;
      for (const item of res.data.size) {
        if (item['S'] !== undefined) {
          S = item['S'];
        }
        if (item['M'] !== undefined) {
          M = item['M'];
        }
        if (item['L'] !== undefined) {
          L = item['L'];
        }
        if (item['XL'] !== undefined) {
          XL = item['XL'];
        }
        if (item['XL'] !== undefined) {
          XXL = item['XXL'];
        }
      }
      const images = res.data?.images
      let imgArrResult = []

      if (images) {
        for (let img of images) {
          imgArrResult.push({
            uid: img.img_id,
            name: 'image.png',
            status: 'done',
            url: `${API_PATH.image}/${img.tshirt_id}/${img.img_id}${img.file_extension}`,
          })
        }
        console.log(imgArrResult)
        handleFileListChange(imgArrResult)
      }

      form.setFieldsValue({
        discount: res.data.discount?.discount_id,
        name: res.data.name,
        price: res.data.price,
        S: S,
        M: M,
        L: L,
        XL: XL,
        XXL: XXL
      });
    })
}

export const createTshirt = (tshirt, fileList, navigate, setError) => {
  axios.post(API_PATH.tshirt, tshirt)
    .then(res => {
      axios.post(API_PATH.tshirt + `/upload/${res.data}`, fileList, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    })
    .then(() => {
      navigate(TSHIRT_URL.INDEX, {
        state: { message: MESSAGE.CREATE_SUCCESS }
      })
    }
    )
    .catch(error => {
      setError('T-shirt name is already existed')
      console.log(error)
    })
}

export const editTshirt = (id, tshirt, fileList, navigate) => {
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

  axios.put(API_PATH.tshirt + `/${id}`, tshirt)
    .then(
      res => {
        axios.post(API_PATH.tshirt + `/upload/${res.data}`, imgArrResult, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(
            navigate(TSHIRT_URL.INDEX, {
              state: { message: MESSAGE.UPDATE_SUCCESS }
            })
          )
      }

    )
    .catch(error => {
      console.log(error)
    })
}