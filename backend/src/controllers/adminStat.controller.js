import Order from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const getAdminStat = async (req, res) => {
    try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });
    const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" });

    res.json({
      totalProducts,
      totalOrders,
      deliveredOrders,
      pendingOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getRecentOrder = async(req,res)=>{
    try {
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // latest first
      .limit(5)
      .populate("orderItems.product"); // populate product details

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export {getAdminStat ,getRecentOrder}