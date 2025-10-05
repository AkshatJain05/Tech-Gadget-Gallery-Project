import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loding";
import { FiCheckCircle, FiShoppingBag, FiMapPin, FiHome, FiCalendar } from "react-icons/fi";

// Format currency
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount || 0);

// Payment badge color
const getPaymentStatusStyle = (status) =>
  status === "Paid" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/user/order/${orderId}`, { withCredentials: true })
      .then((res) => {
        setOrder(res.data.order);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order details:", err);
        setLoading(false);
      });
  }, [orderId, API]);

  if (loading) return <Loading />;

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't retrieve details for order ID: {orderId}.</p>
        <Link to="/my-orders" className="text-blue-600 hover:text-blue-800 font-medium transition">
          Go to My Orders Page
        </Link>
      </div>
    );

  const deliveryAddress = order.shippingInfo || {};

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-white rounded-xl border-t-4 border-green-500 p-6 text-center mb-8">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600">Thank you! Your order has been confirmed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order & Payment Card */}
          <div className="bg-white rounded-xl p-5 border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Order & Payment</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Order ID:</span>
                <span className="font-mono text-gray-800 break-all">{order._id}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-500">Date:</span>
                </div>
                <span className="text-gray-800">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Payment Method:</span>
                <span className="text-gray-800">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Payment Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${getPaymentStatusStyle(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpay_payment_id && (
                <div className="pt-2 border-t mt-2">
                  <span className="font-semibold text-gray-500 block mb-1">Payment ID:</span>
                  <span className="font-mono text-xs text-gray-700 bg-gray-50 p-1 rounded w-full block break-all">
                    {order.razorpay_payment_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-xl p-5 border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <FiShoppingBag className="w-5 h-5 mr-2 text-blue-500" /> Items in Order ({order.orderItems.length})
            </h2>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-4 w-4/5">
                    <img
                      src={item.product?.imageUrl || 'https://via.placeholder.com/48'}
                      alt={item.product?.name}
                      className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
                    />
                    <div className="text-left min-w-0">
                      <p className="font-medium text-gray-800 truncate">{item.product?.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">{formatCurrency(item.product?.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Total & Address */}
        <div className="lg:col-span-1 space-y-6">
          {/* Total Summary */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 sticky top-4">
            <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">Total Amount</h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between">Subtotal ({order.orderItems.length} items)</div>
              <div className="flex justify-between border-t pt-3 font-bold text-gray-900 text-lg">
                <span>Grand Total</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <FiMapPin className="w-5 h-5 mr-2 text-red-500" /> Delivery Address
            </h2>
            <div className="text-gray-700 text-sm space-y-1">
              <p className="font-bold">{deliveryAddress.fullName || 'N/A'}</p>
              <p>{deliveryAddress.address || 'N/A'}</p>
              <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pinCode}</p>
              <p>Phone: {deliveryAddress.phoneNo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 p-4 bg-white rounded-xl border">
        <Link
          to="/"
          className="w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <FiHome className="w-5 h-5 mr-2" /> Continue Shopping
        </Link>
        <Link
          to="/my-orders"
          className="w-full sm:w-auto flex items-center justify-center bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          <FiShoppingBag className="w-5 h-5 mr-2" /> View My Orders
        </Link>
      </div>
    </div>
  );
}
