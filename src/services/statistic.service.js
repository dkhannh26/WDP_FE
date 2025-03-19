import axios from "axios";
import { API_PATH } from "../config/api.config";
import { saveAs } from "file-saver";
export const getStatistic = (
  year,
  setStatistic,
  setOrderByMonth,
  setNumberOfCategory,
  setRatingOfCategory
) => {
  axios
    .get(API_PATH.statistic + `/${year}`)
    .then((res) => {
      const ordersByMonth = res.data.ordersByMonth;
      setStatistic(res.data);

      setOrderByMonth([
        { name: "January", orders: ordersByMonth['01'] },
        { name: "February", orders: ordersByMonth['02'] },
        { name: "March", orders: ordersByMonth['03'] },
        { name: "April", orders: ordersByMonth['04'] },
        { name: "May", orders: ordersByMonth['05'] },
        { name: "June", orders: ordersByMonth['06'] },
        { name: "July", orders: ordersByMonth['07'] },
        { name: "August", orders: ordersByMonth['08'] },
        { name: "September", orders: ordersByMonth['09'] },
        { name: "October", orders: ordersByMonth['10'] },
        { name: "November", orders: ordersByMonth['11'] },
        { name: "December", orders: ordersByMonth['12'] },
      ]);

      const validateRatingOfCategory = [
        {
          avgRating: res?.data?.ratingOfCategory?.find(item => item.category === "racket")?.averageStar || 0,
          category: "Racket"
        },
        {
          avgRating: res?.data?.ratingOfCategory?.find(item => item.category === "tshirt")?.averageStar || 0,
          category: "T-shirt"
        },
        {
          avgRating: res?.data?.ratingOfCategory?.find(item => item.category === "pant")?.averageStar || 0,
          category: "Pants"
        },
        {
          avgRating: res?.data?.ratingOfCategory?.find(item => item.category === "shoes")?.averageStar || 0,
          category: "Shoes"
        },
        {
          avgRating: res?.data?.ratingOfCategory?.find(item => item.category === "accessory")?.averageStar || 0,
          category: "Accessory"
        },
      ]

      setRatingOfCategory(validateRatingOfCategory)

      setNumberOfCategory([
        {
          name: "Racket",
          quantity: res.data.racketNumber,
        },
        {
          name: "T-shirt",
          quantity: res.data.tshirtsNumber,
        },
        {
          name: "Pants",
          quantity: res.data.pantsNumber,
        },
        {
          name: "Shoes",
          quantity: res.data.shoesNumber,
        },
        {
          name: "Accessory",
          quantity: res.data.accessories,
        },
      ]);
    })
    .catch((error) => console.error(error));
};

export const exportExcel = (statistic, ordersByMonth, numberOfCategory, imports, ratings) => {
  console.log("statistic " + JSON.stringify(statistic));
  console.log("ordersByMonth " + JSON.stringify(ordersByMonth));
  console.log("numberOfCategory " + JSON.stringify(numberOfCategory));
  axios
    .post(
      API_PATH.statistic + "/export",
      {
        statistic,
        ordersByMonth,
        numberOfCategory,
        imports,
        ratings
      },
      { responseType: "blob" }
    )
    .then((response) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "statistic_data.xlsx");
    });
};

export const getRatingDetail = async (setRatingDetail, year) => {
  try {
    axios.get(API_PATH.statistic + `/rating-detail/${year}`)
      .then(res => {
        setRatingDetail(res.data)
      })
  } catch (error) {
    console.error(error)
  }
}