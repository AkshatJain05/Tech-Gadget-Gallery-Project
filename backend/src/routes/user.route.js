import express from 'express';
import { bestSellerProduct, getAllProduct, getCategoriesFromProducts, getProductsByCategory, productDetail, searchProduct } from '../controllers/product.controller.js';
import {auth} from "../middlewares/auth.middleware.js"
import { addTOCart, getAllCart, mergeCart, removeCart } from '../controllers/cart.controller.js';
import { createOrder, myOrder, orderStatus } from '../controllers/order.controller.js';
const router = express.Router();

//cart
router.post('/add-to-cart',auth,addTOCart)
router.post('/cart',auth,getAllCart)
router.post('/merge-cart',auth,mergeCart)
router.post('/remove-from-cart',auth,removeCart);

//product
router.get('/get-all-product',getAllProduct)
router.post('/best-seller',bestSellerProduct)
router.get('/product/:id',productDetail)
router.get('/categories',getCategoriesFromProducts)
router.get('/product/category/:category',getProductsByCategory)

//search
router.get('/search',searchProduct)

//order
router.post('/order',auth,createOrder)
router.get("/order/:id", auth,orderStatus);
router.get("/my-orders", auth,myOrder);








export default router;