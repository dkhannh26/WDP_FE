import axios from "axios"
import { API_PATH } from "../../config/api.config"

export const getSearchList = (searchText, setSearchList) => {
    axios.get(API_PATH.search + `/${searchText}`)
        .then(res => {
            // console.log(res.data.data)
            setSearchList(res.data.data)
        })
}