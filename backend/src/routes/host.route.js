import express from 'express'
import { addProduct, getAllProduct, removeProduct } from '../controllers/product.controller.js';
import {auth, isAdmin} from "../middlewares/auth.middleware.js"
import { getAllOrder, updateOrderStatus } from '../controllers/order.controller.js';
import {upload} from '../middlewares/multer.middleware.js'
import { getAdminStat, getRecentOrder } from '../controllers/adminStat.controller.js';
import { searchProduct } from '../controllers/product.controller.js';

const hostRoute = express.Router();

hostRoute.post("/add-product",auth,isAdmin,upload.fields([{ name: "imageUrl", maxCount: 1 }]),addProduct);
hostRoute.delete("/remove-product/:id",auth,isAdmin,removeProduct);
hostRoute.get("/order",auth,isAdmin,getAllOrder)
hostRoute.put("/order/update/:id",auth,isAdmin,updateOrderStatus)
hostRoute.get("/get-all-product",auth,isAdmin,getAllProduct);
hostRoute.get("/dashboard-stats",auth,isAdmin,getAdminStat)
hostRoute.get("/recent-orders",auth,isAdmin,getRecentOrder)
hostRoute.get("/search",auth,isAdmin,searchProduct)



export default hostRoute