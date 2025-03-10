import axios from "axios"
import { API_PATH } from "../../config/api.config"
import { MESSAGE } from "../../config/message.config"
import { TSHIRT_URL } from "../../config/url.config"

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
            console.log(res.data);
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

export const getProductDetailAdmin = (id, form, setSizes, handleFileListChange, setError) => {
    axios.get(API_PATH.product + `/${id}`)
        .then((res) => {
            console.log(res.data);

            setSizes(res.data.size)
            form.setFieldsValue({
                discount: res.data.discount?.discount_id,
                name: res.data.name,
                price: res.data.price,
                brand: res.data.brand?.brand_id,
                S: res.data?.size?.find(item => item.size_name === 'S')?.quantity,
                M: res.data?.size?.find(item => item.size_name === 'M')?.quantity,
                L: res.data?.size?.find(item => item.size_name === 'L')?.quantity,
                XL: res.data?.size?.find(item => item.size_name === 'XL')?.quantity,
                XLL: res.data?.size?.find(item => item.size_name === 'XXL')?.quantity,
                "3U": res.data?.size?.find(item => item.size_name === '3U')?.quantity,
                "4U": res.data?.size?.find(item => item.size_name === '4U')?.quantity,
                "38": res.data?.size?.find(item => item.size_name === '38')?.quantity,
                "39": res.data?.size?.find(item => item.size_name === '39')?.quantity,
                "40": res.data?.size?.find(item => item.size_name === '40')?.quantity,
                "41": res.data?.size?.find(item => item.size_name === '41')?.quantity,
                "42": res.data?.size?.find(item => item.size_name === '42')?.quantity,
            });

            const images = res.data?.images
            let imgArrResult = []

            if (images) {
                for (let img of images) {
                    imgArrResult.push({
                        uid: img.img_id,
                        name: 'image.png',
                        status: 'done',
                        url: `${API_PATH.image}/${img.product_id}/${img.img_id}${img.file_extension}`,
                    })
                }
                handleFileListChange(imgArrResult)
            }
        })
}

export const getListBrand = (setBrands) => {
    axios
        .get(API_PATH.brand)
        .then((res) => {
            console.log(res.data);

            setBrands(res.data);
        })
        .catch((error) => console.error(error));
};


export const editProduct = (id, product, typeProduct, fileList, navigate) => {
    let imgArrResult = []
    if (fileList) { // xư lý các hình có sẵn trong antd để chuyển thành dạng file
        for (let img of fileList) {
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

    axios.put(API_PATH.product + `/${id}`, product)
        .then(
            res => {
                axios.post(API_PATH.product + `/upload/${res.data}`, imgArrResult, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(
                        navigate(`/admin/${typeProduct}`, {
                            state: { message: MESSAGE.UPDATE_SUCCESS }
                        })
                    )
            }
        )
        .catch(error => {
            console.log(error)
        })
}

export const createProduct = (product, fileList, navigate, setError, typeProduct) => {
    console.log(API_PATH.product);

    axios.post(API_PATH.product, product)
        .then(res => {
            axios.post(API_PATH.product + `/upload/${res.data}`, fileList, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        })
        .then(() => {
            navigate(`/admin/${typeProduct}`, {
                state: { message: MESSAGE.CREATE_SUCCESS }
            })
        }
        )
        .catch(error => {
            setError('Product name is already existed')
            console.log(error)
        })
}