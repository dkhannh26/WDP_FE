import axios from "axios"
import { API_PATH } from "../../config/api.config"
import { SHOES_URL } from "../../config/url.config"
import { MESSAGE } from "../../config/message.config"

export const getListShoes = (setShoesList) => {
  axios.get(API_PATH.shoes)
    .then((res) => {
      setShoesList(res.data.data)
    })
    .catch(error => console.error(error))
}

export const getListShoesIncrease = (setShoesList) => {
  axios.get(API_PATH.shoes + '/increase')
    .then((res) => {
      setShoesList(res.data.data)
    })
    .catch(error => console.error(error))
}

export const getListShoesDecrease = (setShoesList) => {
  axios.get(API_PATH.shoes + '/decrease')
    .then((res) => {
      setShoesList(res.data.data)
    })
    .catch(error => console.error(error))
}

export const getShoes = (id, form, handleFileListChange) => {
  axios.get(API_PATH.shoes + `/${id}`)

    .then((res) => {
      console.log(res.data)
      let size39, size40, size41, size42, size43, size38, size37;
      for (const item of res.data.size) {
        if (item['37'] !== undefined) {
          size37 = item['37'];
        }
        if (item['38'] !== undefined) {
          size38 = item['38'];
        }
        if (item['39'] !== undefined) {
          size39 = item['39'];
        }
        if (item['40'] !== undefined) {
          size40 = item['40'];
        }
        if (item['41'] !== undefined) {
          size41 = item['41'];
        }
        if (item['42'] !== undefined) {
          size42 = item['42'];
        }
        if (item['43'] !== undefined) {
          size43 = item['43'];
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
            url: `${API_PATH.image}/${img.shoes_id}/${img.img_id}${img.file_extension}`,
          })
        }
        handleFileListChange(imgArrResult)
      }

      form.setFieldsValue({
        discount: res.data.discount?.discount_id,
        name: res.data.name,
        price: res.data.price,
        size37: size37,
        size38: size38,
        size39: size39,
        size40: size40,
        size41: size41,
        size42: size42,
        size43: size43,
      });
    })
}

export const getShoesCustomer = (id, setShoes, setImages, setCanvas, selectSize) => {
  axios.get(API_PATH.shoes + `/${id}`)
    .then((res) => {
      console.log(res.data)
      setShoes(res.data)
      const images = res.data?.images
      let imgArrResult = []

      if (images) {
        for (let img of images) {
          imgArrResult.push({
            url: `${API_PATH.image}/${img.shoes_id}/${img.img_id}${img.file_extension}`,
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

export const createShoes = (shoes, fileList, navigate) => {
  axios.post(API_PATH.shoes, shoes)
    .then(res => {
      axios.post(API_PATH.shoes + `/upload/${res.data}`, fileList, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    })
    .then(
      navigate(SHOES_URL.INDEX, {
        state: { message: MESSAGE.CREATE_SUCCESS }
      })
    )
    .catch(error => {
      console.log(error)
    })
}

export const editShoes = (id, shoes, fileList, navigate) => {
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

  axios.put(API_PATH.shoes + `/${id}`, shoes)
    .then(
      res => {
        axios.post(API_PATH.shoes + `/upload/${res.data}`, imgArrResult, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(
            navigate(SHOES_URL.INDEX, {
              state: { message: MESSAGE.UPDATE_SUCCESS }
            })
          )
      }

    )
    .catch(error => {
      console.log(error)
    })
}