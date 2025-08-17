import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaShoppingCart, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import axios from "axios";
import Loading from "../../component/Loding";

export default function AdminDashboardUI() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading,setLoading] = useState(true)
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    // Fetch dashboard stats from backend
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/api/host/dashboard-stats`);
        setStats(res.data);
        setLoading(false)
      } catch (err) {
        console.log(err);
        setLoading(false)
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/host/recent-orders`);
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FaShoppingCart size={24} className="text-white" />,
      bg: "bg-orange-500",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FaHourglassHalf size={24} className="text-white" />,
      bg: "bg-yellow-500",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: <FaCheckCircle size={24} className="text-white" />,
      bg: "bg-green-500",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <FaBoxOpen size={24} className="text-white" />,
      bg: "bg-blue-500",
    },
  ];


  if(loading){
    return <Loading/>
  }

return (
    <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 lg:px-8">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200"
                >
                    <div className={`p-4 rounded-full ${card.bg} flex items-center justify-center mb-3 shadow`}>
                        {card.icon}
                    </div>
                    <p className="text-gray-500 text-base font-medium">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
                </div>
            ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold mb-6 text-slate-700 text-center">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-slate-50">
                                <th className="px-4 py-3 font-semibold">Order ID</th>
                                <th className="px-4 py-3 font-semibold">Products</th>
                                <th className="px-4 py-3 font-semibold">Total Price</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 font-mono">{order._id.slice(-6)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                {order.orderItems.map((p, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-700"
                                                    >
                                                        {p.product?.name} ({p.quantity})
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold">₹. {order.totalPrice}</td>
                                        <td
                                            className={`px-4 py-3 font-semibold ${
                                                order.orderStatus === "Delivered"
                                                    ? "text-green-600"
                                                    : "text-yellow-600"
                                            }`}
                                        >
                                            {order.orderStatus}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);
}
