import express from "express";
import razorpay from "../razorpay.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Create Order
router.post("/create-order", auth,async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

export default router;
