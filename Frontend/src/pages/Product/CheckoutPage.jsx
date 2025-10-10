import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

//  React Icons
import {
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiUser,
  FiPhone,
  FiMail,
  FiHome,
  FiPackage,
  FiDollarSign,
  FiCornerRightDown,
} from "react-icons/fi";
import { BsCashCoin } from "react-icons/bs";

export default function CheckoutPage() {
  const shippingCharge = 49;
  const location = useLocation();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Load checkout items
    const localData = JSON.parse(localStorage.getItem("checkoutItem")) || [];
    const navData = location.state?.items || [];
    const itemsToSet = navData.length > 0 ? navData : localData;
    if (!itemsToSet.length) navigate("/");
    setCheckoutItems(itemsToSet);
  }, [location.state, navigate]);

  const totalPrice = checkoutItems.reduce(
    (sum, item) =>
      sum + (item.productId?.price || item.product?.price || 0) * item.quantity,
    0
  );
  const totalAmount = totalPrice + shippingCharge;

  const validateAddress = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (const key of requiredFields) {
      if (!address[key].trim()) {
        toast.error(
          `Please fill in the ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`
        );
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(address.phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return false;
    }

    return true;
  };

  // ----------------- Create order on server -----------------
  const createOrderOnServer = async (method) => {
    try {
      const payload = {
        orderItems: checkoutItems.map((i) => ({
          product: i.productId?._id || i.product?._id,
          quantity: i.quantity,
        })),
        shippingInfo: address,
        totalPrice: totalAmount,
        paymentMethod: method,
        paymentStatus: method === "Online" ? "Pending" : "Paid", // mark online orders pending
        orderStatus: method === "Online" ? "Pending" : "Processing",
      };

      const { data } = await axios.post(`${API}/api/user/order`, payload, {
        withCredentials: true,
      });

      return data.order;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create order.");
      return null;
    }
  };

  const placeCODOrder = async () => {
    if (!validateAddress()) return; // Ensure shipping address is valid

    setIsProcessing(true); // Show loading state

    try {
      // Create order on server with "Cash on Delivery" payment method
      const order = await createOrderOnServer("Cash on Delivery");

      if (order) {
        toast.success("Order placed successfully!"); // Notify user
        localStorage.removeItem("checkoutItem"); // Clear cart items from localStorage
        navigate(`/order-success/${order._id}`); // Redirect to order success page
      }
    } catch (err) {
      console.error("COD Order Error:", err);
      toast.error(err.response?.data?.message || "Failed to place COD order.");
    } finally {
      setIsProcessing(false); // Hide loading state
    }
  };

  const payWithRazorpay = async () => {
    if (!validateAddress()) return;

    setIsProcessing(true);

    try {
      //  Create DB order as Pending
      const order = await createOrderOnServer("Online");
      if (!order) return;

      //  Create Razorpay order
      const { data: razorpayOrderData } = await axios.post(
        `${API}/api/payment/orders`,
        { amount: totalAmount, orderId: order._id }
      );

      if (!razorpayOrderData.success) {
        toast.error("Failed to initiate payment.");
        setIsProcessing(false);
        return;
      }

      //  Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: "INR",
        name: "Tech Gadget Gallery",
        order_id: razorpayOrderData.orderId,
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "#0ea5e9" },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${API}/api/payment/verify`,
              {
                orderId: order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyResponse.data.success) {
              toast.success("Payment successful!");
              localStorage.removeItem("checkoutItem");
              navigate(`/order-success/${order._id}`);
            } else {
              toast.error("Payment verification failed!");
            }
          } catch {
            toast.error("Payment verification failed. Contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: async () => {
            setIsProcessing(false);
            toast("Payment cancelled.");

            // Cancel pending order if user closes Razorpay
            try {
              await axios.post(`${API}/api/payment/cancel-pending`, {
                orderId: order._id,
              });
              console.log("Pending order cancelled");
            } catch (err) {
              console.error("Failed to cancel pending order", err);
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed.");
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && validateAddress()) setCurrentStep(2);
  };

  const StepCircle = ({ step, label, icon: Icon }) => {
    const isCompleted = currentStep > step;
    const isCurrent = currentStep === step;
    return (
      <div className="flex flex-col items-center relative">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
            isCompleted
              ? "bg-green-500 shadow-md"
              : isCurrent
              ? "bg-blue-500 ring-4 ring-blue-200 shadow-lg"
              : "bg-gray-300"
          }`}
        >
          {isCompleted ? (
            <FiCheckCircle className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        <span
          className={`mt-2 text-sm sm:text-base font-medium text-center ${
            isCurrent ? "text-blue-600 font-semibold" : "text-gray-500"
          } hidden sm:block`}
        >
          {label}
        </span>
      </div>
    );
  };

  const renderAddressInput = ({
    name,
    placeholder,
    type = "text",
    colSpan = "",
  }) => (
    <div key={name} className={colSpan}>
      <label className="block text-gray-700 font-medium mb-1 capitalize text-sm">
        {placeholder.replace("Enter ", "")}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={address[name]}
        onChange={(e) => setAddress({ ...address, [name]: e.target.value })}
        className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition placeholder-gray-400"
        required
      />
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiMapPin className="text-blue-500" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderAddressInput({
                name: "fullName",
                placeholder: "Enter Full Name",
                colSpan: "sm:col-span-2",
              })}
              {renderAddressInput({
                name: "phone",
                placeholder: "Enter Phone No.",
                type: "tel",
              })}
              {renderAddressInput({
                name: "email",
                placeholder: "Enter Email",
                type: "email",
              })}
              {renderAddressInput({
                name: "address",
                placeholder: "Enter Full Address",
                colSpan: "sm:col-span-2",
              })}
              {renderAddressInput({ name: "city", placeholder: "Enter City" })}
              {renderAddressInput({
                name: "state",
                placeholder: "Enter State",
              })}
              {renderAddressInput({
                name: "pincode",
                placeholder: "Enter Pin Code",
              })}
            </div>
            <button
              onClick={handleNext}
              className="mt-8 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold text-lg"
            >
              Continue to Payment &rarr;
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiCreditCard className="text-blue-500" /> Payment Method
            </h2>
            <div className="space-y-4">
              {["Cash on Delivery", "Online"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border shadow-sm ${
                    paymentMethod === method
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-300 bg-white hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 checked:bg-blue-600 checked:border-transparent"
                  />
                  <span className="ml-4 text-gray-900 font-semibold text-base flex-1">
                    {method === "Online"
                      ? "Pay Online (Card/UPI/Net Banking)"
                      : "Cash on Delivery (COD)"}
                  </span>
                  {method === "Online" && (
                    <FiCreditCard className="w-6 h-6 text-green-500" />
                  )}
                  {method === "Cash on Delivery" && (
                    <BsCashCoin className="w-6 h-6 text-indigo-500" />
                  )}
                </label>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-gray-600 hover:text-blue-600 font-medium transition py-2 px-4 rounded-lg border border-gray-300 w-full sm:w-auto"
                disabled={isProcessing}
              >
                &larr; Back to Address
              </button>
              {paymentMethod === "Cash on Delivery" ? (
                <button
                  onClick={placeCODOrder}
                  className={`w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-8 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold text-lg ${
                    isProcessing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place COD Order"}
                </button>
              ) : (
                <button
                  onClick={payWithRazorpay}
                  className={`w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-8 rounded-xl shadow-lg hover:from-green-600 hover:to-teal-600 transition-all font-semibold text-lg ${
                    isProcessing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ₹${totalAmount} Now`}
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-14 max-w-7xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Secure Checkout
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7 order-last lg:order-first">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-10 w-full max-w-md mx-auto">
                <StepCircle step={1} label="Address" icon={FiHome} />
                <div
                  className="flex-1 h-1 mt-6 mx-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: currentStep > 1 ? "#34D399" : "#E5E7EB",
                  }}
                />
                <StepCircle step={2} label="Payment" icon={FiCreditCard} />
                <div
                  className="flex-1 h-1 mt-6 mx-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: currentStep > 2 ? "#34D399" : "#E5E7EB",
                  }}
                />
                <StepCircle
                  step={3}
                  label="Confirmation"
                  icon={FiCheckCircle}
                />
              </div>
              {renderStepContent()}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 order-first lg:order-last">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl lg:sticky lg:top-10 border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-4 mb-6 flex items-center gap-2">
                <FiPackage className="text-blue-500" /> Order Summary
              </h2>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-3 border-b pb-4">
                {checkoutItems.map((item, idx) => {
                  const itemPrice =
                    (item.productId?.price || item.product?.price || 0) *
                    item.quantity;
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.productId?.imageUrl ||
                            item.product?.imageUrl ||
                            "https://via.placeholder.com/64"
                          }
                          alt={item.productId?.name || item.product?.name}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm truncate max-w-[150px]">
                            {item.productId?.name || item.product?.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800 text-sm shrink-0">
                        ₹{itemPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="pt-6 mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({checkoutItems.length} items)</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-green-600">
                    {shippingCharge === 0 ? "FREE" : `+ ₹${shippingCharge}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg border-t-2 border-blue-500 pt-3 mt-4">
                  <span>Order Total</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                {currentStep === 2 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                    <p className="font-semibold text-blue-800 flex items-center">
                      <FiCornerRightDown className="mr-1" /> Delivering to:
                    </p>
                    <p className="text-xs text-blue-600 pl-4">
                      <p>Name: {address.fullName}</p>{" "}
                      <p>
                        Address: {address.address}, {address.city},{" "}
                        {address.pincode}
                      </p>
                      <p>State: {address.state}</p>
                      <p>Phone No. {address.phone}</p>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
