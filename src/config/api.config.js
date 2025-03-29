const baseURL = "http://localhost:3000/";

export const API_PATH = {
  user: baseURL + "users",
  discount: baseURL + "discount",
  brand: baseURL + "brand",
  voucher: baseURL + "voucher",
  search: baseURL + "product/search",
  tshirt: baseURL + "product/tshirt",
  product: baseURL + "product",
  shoes: baseURL + "product/shoes",
  accessory: baseURL + "product/accessory",
  pant: baseURL + "product/pant",
  image: baseURL + "images/upload",
  pantShirtSize: baseURL + "size/pantShirtSize",
  shoesSize: baseURL + "size/shoesSize",
  account: baseURL + "admin/account",
  import: baseURL + "import",
  cart: baseURL + "cart",
  cartDelete: baseURL + "cart/delete",
  productDetail: baseURL + "cart/product",
  order: baseURL + "order",
  confirmOrder: baseURL + "order/confirm",
  cancelOrder: baseURL + "order/cancel",
  orderDetails: baseURL + "order/details",
  pendingOrder: baseURL + "order/pending",
  doneOrder: baseURL + "order/done",
  shippedOrder: baseURL + "order/shipped",
  payment: baseURL + "payment",
  feedback: baseURL + "feedback",
  statistic: baseURL + "statistic",
  admin: baseURL + "admin",
  hotProduct: baseURL + "order/hotProduct",
  hotBrand: baseURL + "order/hotBrand",
  sms: baseURL + 'sms/send-email',
  payOS: baseURL + 'payOS/create-payment-link',
  wishlist: baseURL + 'wishlist',
  allDetail: baseURL + 'order/allDetails',
  permission: baseURL + 'permission',
  transitOrder: baseURL + 'order/transit',
  allOrderCustomer: baseURL + 'order/all',
  returnOrder: baseURL + 'order/reason',
  refundOrder: baseURL + 'order/refund',
  confirmRefund: baseURL + "order/confirmRefund",
  rejectRefund: baseURL + "order/refundReject",
  allRefund: baseURL + 'order/allRefund',
  paidOrder: baseURL + 'order/paid',
  readNotification: baseURL + 'notification/read',
  unreadNotification: baseURL + 'notification/unread',
  customerReadNotification: baseURL + 'notification/customerRead'

}
export const PATH = {
  user: baseURL + "users",
  discount: baseURL + "discount",

  login: baseURL + "account/login",

  checkAuth: baseURL + "account/check-auth",

  register: baseURL + "account/register",

  forgotPassword: baseURL + "account/forgot-password",

  resetPassword: baseURL + "account/reset-password",

  updateProfile: baseURL + "account/update",

  profile: baseURL + "account",
};
