import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const shippingCharge = Number(49);

  const location = useLocation();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const onlinePaymentHandler = () => {
    //  const amount = totalPrice+shippingCharge
    // navigate("/dummy-online-payment",{state:{amount}})

    toast.error("Service is currently unavailable");
    setPaymentMethod("Cash on Delivery")
  };
  //    const onlinePaymentHandler = async () => {
  //   try {
  //     // 1. Create order from backend
  //     const { data: order } = await axios.post(
  //       "/api/payment/create-order",
  //       { amount: totalPrice + shippingCharge }
  //     );

  //     // 2. Open Razorpay Checkout
  //     const options = {
  //       key: "rzp_test_1234567890", // replace with your test key
  //       amount: order.amount,
  //       currency: "INR",
  //       name: "Tech Accessories Store",
  //       description: "Order Payment",
  //       order_id: order.id,
  //       handler: function (response) {
  //         // Success callback
  //         alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
  //         setPaymentMethod("Online");

  //         // then place order in backend
  //         placeOrder();
  //       },
  //       prefill: {
  //         name: address.fullName,
  //         email: "customer@example.com",
  //         contact: address.phone,
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };

  //     const rzp1 = new window.Razorpay(options);
  //     rzp1.open();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Payment initiation failed");
  //   }
  // };

  // Load product IDs from localStorage or from cart navigation
  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("checkoutItem")) || [];
    const navData = location.state?.items || [];
    const finalItems = navData.length > 0 ? navData : localData;
    setCheckoutItems(finalItems);
  }, [location.state]);

  const totalPrice = checkoutItems.reduce(
    (sum, item) =>
      sum + (item.productId?.price || item.product?.price) * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.address ||
      !address.pincode ||
      !address.city ||
      !address.state
    ) {
      toast.error("Please fill all required address fields");
      return;
    }

    
     if(paymentMethod == "Online") { 
      toast.error("Payment not completed. Please pay online to place your order.");
      return;
     } 

    const payload = {
      orderItems: checkoutItems.map((i) => ({
        product: i.productId || i.product,
        quantity: i.quantity,
      })),
      shippingInfo: address,
      paymentMethod,
      totalPrice,
    };

    try {
      const res = await axios.post(
        `${API}/api/user/order`,
        payload,
        { withCredentials: true }
      );

      toast.success("Order placed successfully!");
      localStorage.removeItem("checkoutItem"); // clear buy now
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <>
      <div className="p-4 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Address Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Shipping Address</h2>
          {["fullName", "phone", "address", "city", "state", "pincode"].map(
            (field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={address[field]}
                onChange={(e) =>
                  setAddress({ ...address, [field]: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring"
              />
            )
          )}

          <h2 className="text-xl font-bold border-b pb-2 mt-4">
            Payment Method
          </h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={() => setPaymentMethod("Cash on Delivery")}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Online"
                checked={paymentMethod === "Online"}
                onChange={() => setPaymentMethod("Online")}
              />
              Online Payment
            </label>
          </div>

          {paymentMethod === "Online" && (
            <button
              className=" w-45 h-12 font-semibold bg-orange-600 hover:bg-orange-400 text-white py-3 rounded-lg  transition"
              onClick={onlinePaymentHandler}
            >
              Pay with Online
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-4">
          <h2 className="text-xl font-bold border-b pb-2">Order Summary</h2>

          <div className="mt-4 space-y-3">
            {checkoutItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.productId?.imageUrl || item.product?.imageUrl}
                    alt={item.productId?.name || item.product?.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium pr-2">
                      {item.productId?.name || item.product?.name}
                    </p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold">
                  ₹
                  {(item.productId?.price || item.product?.price || 0) *
                    item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">{shippingCharge}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{totalPrice + shippingCharge}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="mt-6 w-full bg-slate-900 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}
