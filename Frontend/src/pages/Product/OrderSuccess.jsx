import  { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loding";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/user/order/${orderId}`, { withCredentials: true })
      .then((res) => {
        setOrder(res.data.order);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return <Loading/>
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600">Order not found</h1>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
    <div className="p-6 max-w-3xl mx-auto text-center">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us! Your order <strong>#{order._id}</strong> has been placed and will be delivered soon.
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-lg mb-3">Order Summary</h2>
          {order.orderItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b py-2 text-sm">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <p>{item.product.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3">
            <span>Total</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </Link>
          <Link
            to="/my-orders"
            className="bg-gray-300 py-2 px-6 rounded-lg hover:bg-gray-300"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
