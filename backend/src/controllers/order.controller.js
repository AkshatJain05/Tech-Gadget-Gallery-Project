import Order from "../models/order.model.js";
import { User } from "../models/user.model.js";


const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingInfo, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    //  console.log("checked2........",req.user._id)

    const order = new Order({
      user: req.user._id, // comes from auth middleware
      orderItems,
      shippingInfo,
      paymentMethod,
      totalPrice,
      paymentStatus: paymentMethod === "Online" ? "Paid" : "Pending",
    });

    const createdOrder = await order.save();

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

const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { orderStatus } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.orderStatus = orderStatus;
    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "Paid";
    }
    await order.save();
    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const orderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "orderItems.product"
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ order });
};

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

const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "userName email")
      .populate("orderItems.product", "name price imageUrl");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export {
  createOrder,
  updateOrderStatus,
  orderStatus,
  myOrder,
  getAllOrder,
};
