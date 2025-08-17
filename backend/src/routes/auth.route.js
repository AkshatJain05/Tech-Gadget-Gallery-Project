import express from "express";
import {login,register,logout, isLogin, adminLogin} from "../controllers/auth.controller.js"
import {auth} from "../middlewares/auth.middleware.js"

const authRouter = express.Router();

authRouter.post("/admin/login",adminLogin)
authRouter.post("/login", login);
authRouter.post("/register",register);
authRouter.post("/logout",logout)
authRouter.get("/me",isLogin)

export default authRouter;