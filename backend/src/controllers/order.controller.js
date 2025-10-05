import Order from "../models/order.model.js";
import { User } from "../models/user.model.js";

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingInfo,
      paymentMethod,
      totalPrice,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = new Order({
      user: req.user._id, // from auth middleware
      orderItems,
      shippingInfo,
      paymentMethod,
      totalPrice,
      paymentStatus: paymentMethod === "Online" ? "Paid" : "Pending",
      razorpay_order_id: razorpay_order_id || null,
      razorpay_payment_id: razorpay_payment_id || null,
      razorpay_signature: razorpay_signature || null,
    });

    const createdOrder = await order.save();

    // Clear user's cart
    await User.findByIdAndUpdate(req.user._id, { $set: { cartItem: [] } });

    res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { orderStatus } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;

    // Automatically mark delivered date & payment status
    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();
      // Mark payment as Paid for both Online and COD
      if (order.paymentStatus !== "Paid") {
        order.paymentStatus = "Paid";
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get order details by ID
const orderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("orderItems.product", "name price imageUrl")
      .populate("user", "userName email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Prepare a clean shipping/delivery address
    const shippingInfo = order.shippingInfo || {};
    const formattedAddress = {
      fullName: shippingInfo.fullName || order.user?.userName || "N/A",
      email: shippingInfo.email || order.user?.email || "N/A",
      phoneNo: shippingInfo.phone || "N/A",
      address: shippingInfo.address || "N/A",
      city: shippingInfo.city || "N/A",
      state: shippingInfo.state || "N/A",
      pinCode: shippingInfo.pincode || shippingInfo.pinCode || "N/A",
    };

    res.json({
      order: {
        _id: order._id,
        orderItems: order.orderItems,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        razorpay_payment_id: order.razorpay_payment_id || null,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        shippingInfo: formattedAddress,
      },
    });
  } catch (error) {
    console.error("Fetch order error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get orders of the logged-in user
const myOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name imageUrl price")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("Fetch my orders error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all orders (admin)
const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "userName email")
      .populate("orderItems.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch all orders error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createOrder, updateOrderStatus, orderStatus, myOrder, getAllOrder };
