const baseURL = "http://localhost:3000/";

export const API_PATH = {
  user: baseURL + "users",
  discount: baseURL + "discount",
  voucher: baseURL + "voucher",
  search: baseURL + "product/search",
  tshirt: baseURL + "product/tshirt",
  shoes: baseURL + "product/shoes",
  accessory: baseURL + "product/accessory",
  pant: baseURL + "product/pant",
  image: baseURL + "images/upload",
  pantShirtSize: baseURL + "size/pantShirtSize",
  shoesSize: baseURL + "size/shoesSize",
  account: baseURL + "admin/account",
  import: baseURL + "import",
  cart: baseURL + 'cart',
  cartDelete: baseURL + 'cart/delete',
  productDetail: baseURL + 'cart/product',
  order: baseURL + 'order',
  confirmOrder: baseURL + 'order/confirm',
  cancelOrder: baseURL + 'order/cancel',
  orderDetails: baseURL + 'order/details',
  pendingOrder: baseURL + 'order/pending',
  doneOrder: baseURL + 'order/done',
  shippedOrder: baseURL + 'order/shipped',
  payment: baseURL + 'payment',
  feedback: baseURL + 'feedback',
  statistic: baseURL + 'statistic',
  admin: baseURL + "admin",
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

