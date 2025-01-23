import axios from "axios"
import { API_PATH } from "../../config/api.config"

export const getProductList = (setProducts, type) => {
    console.log(type);

    axios.get(API_PATH.product + `?category=${type}`)
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