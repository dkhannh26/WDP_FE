import axios from "axios"
import { API_PATH } from "../../config/api.config"
import { MESSAGE } from "../../config/message.config"
import { PANT_URL } from "../../config/url.config"

export const getListPant = (setPants) => {
  axios.get(API_PATH.pant)
    .then((res) => {

      setPants(res.data.data)
    })
    .catch(error => console.error(error))
}


export const getListPantIncrease = (setPants) => {
  axios.get(API_PATH.pant + '/increase')
    .then((res) => {
      setPants(res.data.data)
    })
    .catch(error => console.error(error))
}


export const getListPantDecrease = (setPants) => {
  axios.get(API_PATH.pant + '/decrease')
    .then((res) => {
      setPants(res.data.data)
    })
    .catch(error => console.error(error))
}

export const getPant = (id, form, handleFileListChange) => {
  axios.get(API_PATH.pant + `/${id}`)
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
            url: `${API_PATH.image}/${img.pant_id}/${img.img_id}${img.file_extension}`,
          })
        }
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

export const getPantCustomer = (id, setPant, setImages, setCanvas, selectSize) => {
  axios.get(API_PATH.pant + `/${id}`)
    .then((res) => {
      console.log(res.data)
      setPant(res.data)
      const images = res.data?.images
      let imgArrResult = []

      if (images) {
        for (let img of images) {
          imgArrResult.push({
            url: `${API_PATH.image}/${img.pant_id}/${img.img_id}${img.file_extension}`,
          })
        }
      }
      if (imgArrResult[0]) {
        setCanvas(imgArrResult[0]?.url)
      }
      setImages(imgArrResult)
      selectSize(Object.keys(res.data.size[0])[0], Object.values(res.data.size[0])[0], Object.values(res.data.size[0])[1])
    }
    )
}

export const createPant = (pant, fileList, navigate) => {
  axios.post(API_PATH.pant, pant)
    .then(res => {
      axios.post(API_PATH.pant + `/upload/${res.data}`, fileList, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    })
    .then(
      navigate(PANT_URL.INDEX, {
        state: { message: MESSAGE.CREATE_SUCCESS }
      })
    )
    .catch(error => {
      console.log(error)
    })
}

export const editPant = (id, pant, fileList, navigate, setLoad) => {
  let imgArrResult = []
  if (fileList) { // xư lý các hình có sẵn trong antd để chuyển thành dạng file
    for (let img of fileList) {
      // console.log(img)
      if (img.url) {
        fetch(img?.url)
          .then(response => response.blob())  // Chuyển phản hồi thành Blobz
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

  axios.put(API_PATH.pant + `/${id}`, pant)
    .then(
      res => {
        axios.post(API_PATH.pant + `/upload/${res.data}`, imgArrResult, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(setLoad(true))
          .then(
            setTimeout(() => navigate(PANT_URL.INDEX, {
              state: { message: MESSAGE.UPDATE_SUCCESS }
            }), 1500)
          )
      }

    )
    .catch(error => {
      console.log(error)
    })
}