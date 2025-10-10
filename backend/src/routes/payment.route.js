import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createRazorpayOrder, verifyRazorpayPayment , cancelPendingOrder } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/orders", auth, createRazorpayOrder);

// Verify Razorpay payment (called after payment success)
router.post("/verify", auth, verifyRazorpayPayment);

//cancel pending payment order
router.post("/cancel-pending",auth, cancelPendingOrder)

export default router;
