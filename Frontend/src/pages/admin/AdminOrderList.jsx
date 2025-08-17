import  { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../component/Loding";

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading ,setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/host/order");
      setOrders(res.data);
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/host/order/update/${orderId}`, {
        orderStatus: newStatus,
      });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (err) {
      console.log(err);
    }
  };


  if(loading){
    return <Loading/>
  }
  return (
    <div className="p-4 max-w-6xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex-1">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order._id.slice(-6)}
                </p>
                <p>
                  <span className="font-semibold">Products:</span>{" "}
                  {order.orderItems
                    .map((p) => `${p.product?.name} (${p.quantity})`)
                    .join(", ")}
                </p>
                <p>
                  <span className="font-semibold">Total Price:</span> ₹
                  {order.totalPrice}
                </p>
                <p className={`${order.orderStatus=="Delivered" ? "text-green-600":"text-yellow-700"}`}>
                  <span className="font-semibold">Status:</span> {order.orderStatus}
                </p>
              </div>

              <div className="flex gap-2 items-center mt-2 sm:mt-0">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-400 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">Order Details</h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Order ID:</span>{" "}
                {selectedOrder._id}
              </p>
              <p>
                <span className="font-semibold">User:</span>{" "}
                {selectedOrder.user.userName} ({selectedOrder.user.email})
              </p>
              <p>
                <span className="font-semibold">Payment Method:</span>{" "}
                {selectedOrder.paymentMethod}
              </p>
              <p>
                <span className="font-semibold">Payment Status:</span>{" "}
                {selectedOrder.paymentStatus}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold">Order Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) =>
                    updateStatus(selectedOrder._id, e.target.value)
                  }
                  className={`p-2 rounded-lg border ${
                    selectedOrder.orderStatus === "Delivered"
                      ? "bg-green-100 border-green-400 text-green-700"
                      : selectedOrder.orderStatus === "Cancelled"
                      ? "bg-red-100 border-red-400 text-red-700"
                      : "bg-yellow-100 border-yellow-400 text-yellow-700"
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <p>
                <span className="font-semibold">Total Price:</span> ₹
                {selectedOrder.totalPrice}
              </p>
              <p className="font-semibold mt-2">Shipping Address:</p>
              <p>
                {selectedOrder.shippingInfo.address},{" "}
                {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state},{" "}
                {selectedOrder.shippingInfo.country} - {selectedOrder.shippingInfo.pincode}
              </p>
              <p>Phone: {selectedOrder.shippingInfo.phone}</p>

              <p className="font-semibold mt-2">Products:</p>
              <ul className="list-disc list-inside">
                {selectedOrder.orderItems.map((item) => (
                  <li key={item.product?._id || item.productId?._id}>
                    {item.product?.name || item.productId?.name} × {item.quantity} (₹. 
                    {item.product?.price})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
