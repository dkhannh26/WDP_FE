import axios from "axios"
import { API_PATH } from "../../config/api.config"

export const getProductList = (setProducts, type, brand) => {

    let typeLowercase = type.toLowerCase()

    axios.get(API_PATH.product + `?category=${typeLowercase}&&brand=${brand}`)
        .then((res) => {
            setProducts(res.data.data)
        })
        .catch(error => console.error(error))
}


export const getProductDetail = (id, setProduct, setImages, setCanvas) => {
    axios.get(API_PATH.product + `/${id}`)
        .then((res) => {
            // console.log(res.data)
            setProduct(res.data)
            const images = res.data?.images
            let imgArrResult = []

            if (images) {
                for (let img of images) {
                    imgArrResult.push({
                        url: `${API_PATH.image}/${img.product_id}/${img.img_id}${img.file_extension}`,
                    })
                }
            }
            if (imgArrResult[0]) {
                setCanvas(imgArrResult[0]?.url)
            }
            setImages(imgArrResult)
        }
        )
}

export const getProductDetailCustomer = (id, setProduct, setImages, setCanvas, selectSize) => {
    axios.get(API_PATH.product + `/${id}`)
        .then((res) => {
            // console.log(res.data)
            setProduct(res.data)
            const images = res.data?.images
            let imgArrResult = []

            if (images) {
                for (let img of images) {
                    imgArrResult.push({
                        url: `${API_PATH.image}/${img.product_id}/${img.img_id}${img.file_extension}`,
                    })
                }
            }
            if (imgArrResult[0]) {
                setCanvas(imgArrResult[0]?.url)
            }
            setImages(imgArrResult)

            console.log(res.data.size);
            console.log(Object?.values(res?.data?.size[0])[0], Object?.values(res?.data?.size[0])[0], Object?.values(res?.data?.size[0])[1])

            console.log(res?.data?.size[0].size_name);
            if (res.data.size) {
                selectSize(res?.data?.size[0].size_name, res?.data?.size[0].quantity, res?.data?.size[0].product_size_id)
            }
        }
        )
}