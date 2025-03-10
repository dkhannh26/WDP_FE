import axios from "axios"
import { API_PATH } from "../../config/api.config"
import { RACKET_URL } from "../../config/url.config"
import { MESSAGE } from "../../config/message.config"

export const getListRacket = (setRackets) => {
    axios.get(API_PATH.racket)
        .then((res) => {
            setRackets(res.data.data)
        })
        .catch(error => console.error(error))
}

export const getRacketCustomer = (id, setRacket, setImages, setCanvas, selectSize) => {
    axios.get(API_PATH.racket + `/${id}`)
        .then((res) => {
            setRacket(res.data)
            const images = res.data?.images
            let imgArrResult = []

            if (images) {
                for (let img of images) {
                    imgArrResult.push({
                        url: `${API_PATH.image}/${img.racket_id}/${img.img_id}${img.file_extension}`,
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

export const getListRacketIncrease = (setRacketList) => {
    axios.get(API_PATH.racket + '/increase')
        .then((res) => {
            setRacketList(res.data.data)
            console.log('/increase')
        })
        .catch(error => console.error(error))
}

export const getListRacketDecrease = (setRacketList) => {
    axios.get(API_PATH.racket + '/decrease')
        .then((res) => {
            setRacketList(res.data.data)
        })
        .catch(error => console.error(error))
}


export const getRacket = (id, form, handleFileListChange, setError) => {
    axios.get(API_PATH.racket + `/${id}`)
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
                        url: `${API_PATH.image}/${img.racket_id}/${img.img_id}${img.file_extension}`,
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

export const createRacket = (racket, fileList, navigate, setError) => {
    axios.post(API_PATH.racket, racket)
        .then(res => {
            axios.post(API_PATH.racket + `/upload/${res.data}`, fileList, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        })
        .then(() => {
            navigate(RACKET_URL.INDEX, {
                state: { message: MESSAGE.CREATE_SUCCESS }
            })
        }
        )
        .catch(error => {
            setError('Racket name is already existed')
            console.log(error)
        })
}

export const editRacket = (id, racket, fileList, navigate) => {
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

    axios.put(API_PATH.racket + `/${id}`, racket)
        .then(
            res => {
                axios.post(API_PATH.racket + `/upload/${res.data}`, imgArrResult, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(
                        navigate(RACKET_URL.INDEX, {
                            state: { message: MESSAGE.UPDATE_SUCCESS }
                        })
                    )
            }

        )
        .catch(error => {
            console.log(error)
        })
}