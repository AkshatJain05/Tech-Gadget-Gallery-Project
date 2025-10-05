import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/order.model.js";

dotenv.config();

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------------------- Create Razorpay Order ----------------------
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${orderId}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Optionally, save Razorpay order ID in DB
    await Order.findByIdAndUpdate(orderId, { razorpay_order_id: razorpayOrder.id });

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};

// ---------------------- Verify Razorpay Payment ----------------------
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ success: false, message: "Incomplete payment data" });
    }

    // Step 1: Generate expected signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Step 2: Compare signatures
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Step 3: Update order in DB
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "Paid",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderStatus: "Processing", // or keep your logic
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, verified: true, message: "Payment verified successfully", order: updatedOrder });
  } catch (error) {
    console.error("Verify Razorpay Payment Error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
