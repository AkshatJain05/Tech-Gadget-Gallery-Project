import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../component/Loding";

// --- React Icons Imports (Feather) ---
import {
  FiPackage,
  FiXCircle,
  FiCheckCircle,
  FiShoppingBag,
  FiChevronRight,
  FiCreditCard,
  FiTag,
  FiChevronLeft, // New icon for pagination
  FiChevronsLeft, // New icon for pagination (First Page)
  FiChevronsRight, // New icon for pagination (Last Page)
} from "react-icons/fi";

// --- CONFIGURATION CONSTANTS ---
const ORDERS_PER_PAGE = 5; // Define how many orders to show per page

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to get status badge styling and the React Icon
const getStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return {
        text: "text-green-700",
        bg: "bg-green-100",
        icon: <FiCheckCircle className="w-3 h-3 mr-1 sm:w-4 sm:h-4" />,
      };
    case "Cancelled":
      return {
        text: "text-red-700",
        bg: "bg-red-100",
        icon: <FiXCircle className="w-3 h-3 mr-1 sm:w-4 sm:h-4" />,
      };
    default:
      return {
        text: "text-yellow-700",
        bg: "bg-yellow-100",
        icon: <FiPackage className="w-3 h-3 mr-1 sm:w-4 sm:h-4" />,
      };
  }
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const API = import.meta.env.VITE_API_URL;

  // --- Data Fetching ---
  useEffect(() => {
    axios
      .get(`${API}/api/user/my-orders`, { withCredentials: true })
      .then((res) => {
        const sortedOrders = res.data.orders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [API]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;

  // Orders to display on the current page
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
    }
  };

  if (loading) return <Loading />;

  // --- Empty State ---
  if (!orders.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4 bg-gray-50">
        <FiShoppingBag className="w-14 h-14 text-blue-500 mb-3" />
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">
          No Orders Found
        </h1>
        <p className="text-sm text-gray-600 mb-4 max-w-sm">
          Start your shopping journey!
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Explore Products
        </Link>
      </div>
    );

  // --- Main Orders List (Enhanced Design with Pagination) ---
  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">
        My Orders
      </h1>

      <div className="space-y-6 sm:space-y-8">
        {/* Use currentOrders for mapping */}
        {currentOrders.map((order) => {
          const status = getStatusBadge(order.orderStatus);

          return (
            <div
              key={order._id}
              className="bg-white shadow-xl rounded-xl border border-gray-100 p-4 transition duration-300 hover:ring-2 hover:ring-blue-200"
            >
              {/* HEADER ROW: ID, Date, Status, Total */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b mb-3">
                {/* 1. ID & Date */}
                <div className="space-y-1 order-2 sm:order-1 mt-3 sm:mt-0">
                  <p className="text-sm font-medium text-gray-700">
                    Order ID:{" "}
                    <span className="font-mono text-gray-900 text-xs sm:text-sm break-all">
                      {order._id}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Placed on:{" "}
                    <span className="font-semibold text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>

                {/* 2. Status & Total - Grouped and displayed prominently */}
                <div className="flex justify-between items-center w-full sm:w-auto order-1 sm:order-2">
                  <div
                    className={`flex items-center font-semibold text-sm px-2 py-1 rounded-full ${status.bg} ${status.text}`}
                  >
                    {status.icon}
                    {order.orderStatus}
                  </div>
                  <p className="flex items-center text-xl font-extrabold text-gray-900 ml-4">
                    <FiTag className="w-5 h-5 mr-1 text-gray-400" />
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>
              </div>

              {/* PAYMENT DETAILS BLOCK */}
              <div className="bg-blue-50 p-3 rounded-lg flex items-center mb-4 border border-blue-100">
                <FiCreditCard className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <div className="text-xs sm:text-sm flex flex-col sm:flex-row sm:justify-between w-full">
                  <div>
                    <p className="font-bold text-blue-800">
                      {order.paymentMethod} -{" "}
                      <span className="font-semibold text-gray-700">
                        {order.paymentStatus}
                      </span>
                    </p>
                    {order.razorpay_payment_id && (
                      <p className="text-gray-600 mt-0.5">
                        Payment ID:{" "}
                        <span className="font-mono text-gray-800 break-all">
                          {order.razorpay_payment_id}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items List (Compact and Numbered) */}
              <div className="divide-y divide-gray-100 bg-gray-50 rounded-lg">
                <p className="text-sm font-bold text-gray-600 p-2 border-b">
                  Items Ordered ({order.orderItems.length})
                </p>
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 px-2 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center w-[85%] gap-2">
                      <span className="text-sm font-semibold text-gray-600">
                        {idx + 1}.
                      </span>
                      <img
                        src={item.product?.imageUrl || "placeholder-url"}
                        alt={item.product?.name}
                        className="w-10 h-10 object-cover rounded-md border flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm  truncate text-gray-800">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty:{" "}
                          <span className="font-medium">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-blue-700 flex-shrink-0 ml-2">
                      {formatCurrency(item.product?.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer and Action Button (Small Button) */}
              <div className="text-right mt-4 pt-3 border-t">
                <Link
                  to={`/order-success/${order._id}`}
                  className="inline-flex items-center justify-center bg-gray-900 text-white font-medium px-4 py-1.5 rounded-lg hover:bg-gray-700 transition duration-300 shadow-md text-sm"
                >
                  Details
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8 p-4 border-t">
          {/* First Page Button */}
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50 transition"
            aria-label="Go to first page"
          >
            <FiChevronsLeft className="w-5 h-5" />
          </button>

          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50 transition"
            aria-label="Go to previous page"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Numbers */}
          <span className="text-sm font-semibold text-gray-700 px-3 py-1 bg-blue-100 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50 transition"
            aria-label="Go to next page"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50 transition"
            aria-label="Go to last page"
          >
            <FiChevronsRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
