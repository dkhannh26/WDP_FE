import axios from "axios";
import { API_PATH } from "../config/api.config";
import { saveAs } from "file-saver";
export const getStatistic = (
  year,
  setStatistic,
  setOrderByMonth,
  setNumberOfCategory
) => {
  axios
    .get(API_PATH.statistic + `/${year}`)
    .then((res) => {
      const ordersByMonth = res.data.ordersByMonth;
      setStatistic(res.data);
      console.log(res.data);
      setOrderByMonth([
        { name: "January", orders: ordersByMonth[1] },
        { name: "February", orders: ordersByMonth[2] },
        { name: "March", orders: ordersByMonth[3] },
        { name: "April", orders: ordersByMonth[4] },
        { name: "May", orders: ordersByMonth[5] },
        { name: "June", orders: ordersByMonth[6] },
        { name: "July", orders: ordersByMonth[7] },
        { name: "August", orders: ordersByMonth[8] },
        { name: "September", orders: ordersByMonth[9] },
        { name: "October", orders: ordersByMonth[10] },
        { name: "November", orders: ordersByMonth[11] },
        { name: "December", orders: ordersByMonth[12] },
      ]);

      setNumberOfCategory([
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

export const exportExcel = (statistic, ordersByMonth, numberOfCategory) => {
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
