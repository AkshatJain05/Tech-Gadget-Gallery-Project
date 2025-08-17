import { FaTrash } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { motion, AnimatePresence } from "motion/react";
import Loading from "../../component/Loding";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, fetchServerCart, removeFromCart } = useContext(CartContext);
  const [localCart, setLocalCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const SHIPPING_COST = 49; // Flat shipping rate

   const navigate = useNavigate();
  useEffect(() => {
    fetchServerCart();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLocalCart(cart);
    setLoading(false);
  }, [cart]);

  const handleRemove = (productId) => {
    setLocalCart((prev) =>
      prev.filter(
        (item) =>
          item.productId?._id !== productId && item.productId !== productId
      )
    );
    removeFromCart(productId);
  };

  // Calculate Summary
  const totalItems = localCart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = localCart.reduce(
    (acc, item) =>
      acc + (item.productId?.price || item.product?.price) * item.quantity,
    0
  );

  // const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const totalAmount = subtotal + SHIPPING_COST;

   const handleProceedToCheckout = ()=>{
         navigate("/checkout", { state: { items: cart } })
   }
  



  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🛒 Your Shopping Cart
      </h1>

      {localCart.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Cart Items */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
            <AnimatePresence>
              {localCart.map((item, idx) => (
                <motion.div
                  key={item.productId?._id || item.productId || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between border-b last:border-b-0 py-3 gap-3 sm:gap-6"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <img
                      src={item.productId?.imageUrl || item.product?.imageUrl}
                      alt={item.productId?.name || item.product?.name}
                      className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-md shadow-sm"
                    />
                    <div className="text-sm sm:text-base">
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {item.productId?.name || item.product?.name}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        ₹{item.productId?.price || item.product?.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-sm sm:text-base font-bold text-gray-800">
                    ₹{(item.productId?.price || item.product?.price) * item.quantity}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId?._id || item.productId)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                  >
                    <FaTrash className="h-16 cursor-pointer" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Side - Summary */}
          <div className="w-full lg:w-1/3 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-lg p-5 h-fit sticky top-4 border border-blue-100">
            <h2 className="text-lg font-bold border-b pb-3 mb-4 text-gray-800">
              Order Summary
            </h2>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Total Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Shipping</span>
              <span
                className={`font-medium ${
                   "text-green-600" 
                }`}
              >
                {SHIPPING_COST}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3 text-gray-900">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            {/* {shipping > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Spend ₹{FREE_SHIPPING_THRESHOLD - subtotal} more for free
                shipping!
              </p>
            )} */}

            <button onClick={handleProceedToCheckout}
            className="mt-5 w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white py-3 rounded-lg hover:from-slate-700 hover:to-slate-500 transition font-semibold shadow-lg">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
