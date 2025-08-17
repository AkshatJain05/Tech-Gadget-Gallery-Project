import  { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../component/Loding";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL
  
  useEffect(() => {
    axios
      .get(`${API}/api/user/my-orders`, { withCredentials: true })
      .then((res) => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  console.log(orders)
  if (loading) {
    return <Loading/>
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold">No Orders Found</h1>
        <Link to="/" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition"
          >
            {/* Order header */}
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <div>
                <p className="text-gray-500 text-sm">
                  Order ID: <span className="font-mono">{order._id}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  order.orderStatus === "Delivered" ? "text-green-600" : "text-yellow-600"
                }`}>
                  {order.orderStatus}
                </p>
                <p className="text-gray-500 text-sm">{order.paymentMethod} - {order.paymentStatus}</p>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y bg-gray-50 rounded-lg mb-4">
                {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-4 px-2 hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                            <img
                                src={item.product?.imageUrl}
                                alt={item.product?.name}
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <div>
                                <p className="font-semibold text-lg">{item.product?.name}</p>
                                <p className="text-gray-500 text-sm">Qty: <span className="font-medium">{item.quantity}</span></p>
                            </div>
                        </div>
                        <span className="font-bold text-blue-700 text-lg">₹{item.product?.price * item.quantity}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="font-bold">Total: ₹{order.totalPrice}</p>
              <Link
                to={`/order-success/${order._id}`}
                className="bg-slate-950 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
