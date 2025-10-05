import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/orders", auth, createRazorpayOrder);

// Verify Razorpay payment (called after payment success)
router.post("/verify", auth, verifyRazorpayPayment);

export default router;
