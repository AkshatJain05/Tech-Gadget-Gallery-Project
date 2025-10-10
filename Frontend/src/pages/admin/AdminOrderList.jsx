import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Loading from "../../component/Loding";

// Icons
import { 
  FiSearch, FiChevronLeft, FiChevronRight, FiPackage, 
  FiUser, FiMail, FiDollarSign, FiCalendar, FiZap, 
  FiX, FiClipboard, FiMapPin, FiPhone 
} from 'react-icons/fi'; 
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdOutlineDateRange } from 'react-icons/md';
import { FaRupeeSign } from "react-icons/fa";
import toast from "react-hot-toast";

// Status badge colors
const getStatusClasses = (status) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-700 border-green-300";
    case "Cancelled": return "bg-red-100 text-red-700 border-red-300";
    case "Shipped": return "bg-blue-100 text-blue-700 border-blue-300";
    case "Processing": return "bg-indigo-100 text-indigo-700 border-indigo-300";
    case "Pending": default: return "bg-yellow-100 text-yellow-700 border-yellow-300";
  }
};

// Format price
const formatCurrency = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ordersPerPage = 15;

  const API = import.meta.env.VITE_API_URL;

  // Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/host/order`);
      const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Update Order Status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/api/host/order/update/${orderId}`, { orderStatus: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (selectedOrder?._id === orderId) setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };


const statusPriority = {
  "Processing": 1,
  "Pending": 2,
  "Shipped": 3,
  "Delivered": 4,
  "Cancelled": 5 // Only relevant if filter = "Cancelled"
};

const filteredOrders = useMemo(() => {
  let tempOrders = [...orders];

  if (filterStatus === "Cancelled") {
    tempOrders = tempOrders.filter(o => o.orderStatus === "Cancelled");
  } else if (filterStatus !== "All") {
    tempOrders = tempOrders.filter(o => o.orderStatus === filterStatus);
  } else {
    tempOrders = tempOrders.filter(o => o.orderStatus !== "Cancelled"); // Exclude cancelled
  }

  if (search.trim()) {
    const lower = search.toLowerCase();
    tempOrders = tempOrders.filter(o =>
      o._id.includes(search) ||
      (o.razorpay_payment_id && o.razorpay_payment_id.includes(search)) ||
      o.user.userName.toLowerCase().includes(lower) ||
      o.user.email.toLowerCase().includes(lower)
    );
  }

  // Custom sort by status priority, then by date descending
  tempOrders.sort((a, b) => {
    if (statusPriority[a.orderStatus] !== statusPriority[b.orderStatus]) {
      return statusPriority[a.orderStatus] - statusPriority[b.orderStatus];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return tempOrders;
}, [search, filterStatus, orders]);

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  useEffect(() => { setCurrentPage(1); }, [filteredOrders]);

  const formatDate = (t) => {
    const d = new Date(t);
    return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-2 flex items-center gap-2">
        <FiPackage className="w-8 h-8 text-orange-500"/> Admin Order Management
      </h2>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative w-full md:w-2/3">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
          <input
            type="text"
            placeholder="Search by ID, Payment ID, User, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map(order => (
              <tr key={order._id} className="hover:bg-orange-50/50 cursor-pointer transition" onClick={() => setSelectedOrder(order)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate">{order._id.slice(-6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">{order.user.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{formatCurrency(order.totalPrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.paymentMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(order.orderStatus)}`}>{order.orderStatus}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}
                    className="text-orange-600 hover:text-orange-900 transition font-semibold"
                  >Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentOrders.map(order => (
          <div key={order._id} className="bg-white rounded-xl shadow-lg p-5 border-t-4 border-orange-500 space-y-2 cursor-pointer hover:shadow-xl transition" onClick={() => setSelectedOrder(order)}>
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                <FiZap className="w-4 h-4 text-orange-500"/> ID: {order._id.slice(-6)}
              </span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusClasses(order.orderStatus)}`}>{order.orderStatus}</span>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1"><FiUser className="w-4 h-4"/> {order.user.userName}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><FaIndianRupeeSign className="w-4 h-4"/> {formatCurrency(order.totalPrice)}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1"><FiMail className="w-4 h-4"/> {order.paymentMethod}</p>
            {order.razorpay_payment_id && <p className="text-xs text-gray-500 flex items-center gap-1"><FiClipboard className="w-4 h-4"/> Payment ID: <span className="font-mono">{order.razorpay_payment_id}</span></p>}
            <p className="text-xs text-gray-400 flex items-center gap-1"><MdOutlineDateRange className="w-4 h-4"/> {formatDate(order.createdAt)}</p>
            <button className="w-full mt-3 bg-orange-500 text-white text-sm py-2 rounded-lg hover:bg-orange-600 transition shadow-md">View Details</button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"><FiChevronLeft className="w-5 h-5"/></button>
          <span className="text-sm font-medium text-gray-700">Page <span className="font-bold text-orange-600">{currentPage}</span> of {totalPages}</span>
          <button onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"><FiChevronRight className="w-5 h-5"/></button>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-2xl transform scale-100 transition-all duration-300 ease-out max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3 mb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FiPackage className="w-6 h-6 text-orange-500"/> Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-800 transition p-1"><FiX className="w-6 h-6"/></button>
            </div>

            <div className="space-y-4 text-gray-700">
              <DetailItem title="Order ID" value={selectedOrder._id} mono icon={<FiZap className="w-4 h-4"/>}/>
              <DetailItem title="Customer" value={`${selectedOrder.user.userName} (${selectedOrder.user.email})`} icon={<FiUser className="w-4 h-4"/>}/>
              <DetailItem title="Total Price" value={formatCurrency(selectedOrder.totalPrice)} icon={<FaRupeeSign className="w-4 h-4"/>} boldValue/>
              <DetailItem title="Payment Mode" value={selectedOrder.paymentMethod} icon={<FiMail className="w-4 h-4"/>}/>
              {selectedOrder.razorpay_payment_id && <DetailItem title="Payment ID" value={selectedOrder.razorpay_payment_id} mono copy icon={<FiClipboard className="w-4 h-4"/>}/>}
              <DetailItem title="Order Date" value={formatDate(selectedOrder.createdAt)} icon={<FiCalendar className="w-4 h-4"/>}/>

              {/* Status Update */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t mt-4">
                <span className="font-semibold text-sm w-36 shrink-0">Update Status:</span>
                <select value={selectedOrder.orderStatus} onChange={(e) => updateStatus(selectedOrder._id, e.target.value)} className={`p-2 rounded-lg border flex-1 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${getStatusClasses(selectedOrder.orderStatus)}`}>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Shipping Address */}
              <div className="pt-3 border-t">
                <p className="font-bold mb-1 text-base flex items-center gap-2"><FiMapPin className="w-5 h-5 text-orange-500"/> Shipping Address:</p>
                <div className="text-sm bg-gray-50 p-3 rounded-lg border">
                  <p><span className="font-bold">Name:</span> {selectedOrder.shippingInfo.fullName}</p>
                  <p><span className="font-bold">Address:</span> {selectedOrder.shippingInfo.address}</p>
                  <p>{selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} - {selectedOrder.shippingInfo.pincode}</p>
                  <p>{selectedOrder.shippingInfo.country || "India"}</p>
                  <p className="flex items-center gap-1"><FiPhone className="w-3 h-3 font-bold"/> {selectedOrder.shippingInfo.phone}</p>
                </div>
              </div>

              {/* Products */}
              <div className="pt-3 border-t">
                <p className="font-bold mb-2 text-base flex items-center gap-2"><FiPackage className="w-5 h-5 text-orange-500"/> Products:</p>
                <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {selectedOrder.orderItems.map(item => (
                    <li key={item.product?._id || item.productId?._id} className="text-sm bg-orange-50 p-2 rounded-lg flex justify-between items-center">
                      <span className="font-medium">{item.product?.name || item.productId?.name}</span>
                      <span className="text-gray-600">×{item.quantity} ({formatCurrency(item.product?.price || item.productId?.price)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Detail Item
const DetailItem = ({ title, value, icon, mono=false, boldValue=false, copy=false }) => {
  const handleCopy = () => { navigator.clipboard.writeText(value); toast.success(`${title} copied!`); };
  return (
    <p className="flex items-center text-sm gap-2">
      {icon}
      <span className="font-semibold w-24 shrink-0">{title}:</span>
      <span className={`${mono?'font-mono text-xs':''} ${boldValue?'font-bold text-base text-orange-600':''} flex-1 break-all`}>{value}</span>
      {copy && <button onClick={handleCopy} className="text-orange-500 hover:text-orange-700 text-xs font-medium ml-2 shrink-0" title="Copy"><FiClipboard className="w-4 h-4"/></button>}
    </p>
  );
};
