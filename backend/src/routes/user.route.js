import express from "express";
import {
  bestSellerProduct,
  getAllProduct,
  getCategoriesFromProducts,
  getProductsByCategory,
  productDetail,
  searchProduct,
} from "../controllers/product.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

import {
  addTOCart,
  getAllCart,
  mergeCart,
  removeCart,
} from "../controllers/cart.controller.js";

import {
  createOrder,
  myOrder,
  orderStatus,
} from "../controllers/order.controller.js";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

/* --------------------- Cart Routes --------------------- */
router.post("/add-to-cart", auth, addTOCart);
router.post("/cart", auth, getAllCart);
router.post("/merge-cart", auth, mergeCart);
router.post("/remove-from-cart", auth, removeCart);

/* ------------------- Product Routes ------------------- */
router.get("/get-all-product", getAllProduct);
router.post("/best-seller", bestSellerProduct);
router.get("/product/:id", productDetail);
router.get("/categories", getCategoriesFromProducts);
router.get("/product/category/:category", getProductsByCategory);

/* -------------------- Search Route -------------------- */
router.get("/search", searchProduct);

/* --------------------- Order Routes ------------------- */
router.post("/order", auth, createOrder); // create order
router.get("/order/:id", auth, orderStatus); // single order details
router.get("/my-orders", auth, myOrder); // logged-in user orders

/* ------------------ Razorpay Payment Routes ------------------ */
router.post("/payment/orders", auth, createRazorpayOrder); // create razorpay order
router.post("/payment/verify", auth, verifyRazorpayPayment); // verify payment

export default router;
