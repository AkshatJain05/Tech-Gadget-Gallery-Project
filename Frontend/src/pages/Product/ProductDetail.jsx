import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios"; // Use the configured axios if you made the file above
import { FaShoppingCart, FaBolt, FaCheckCircle, FaTruck, FaLock } from "react-icons/fa";
import Loading from "../../component/Loding";
import { CartContext } from "../../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null); // Added error state
  const { addToCart, buyNow } = useContext(CartContext);

  // Configuration for API URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || ""; 

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        // Ensure the path is correct for your deployed backend
        const res = await axios.get(`${API_BASE}/api/user/product/${id}`);
        if (isMounted) {
          setProduct(res.data?.product || res.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) setError("Product not found or Server Error");
      }
    };

    fetchProduct();
    return () => { isMounted = false; };
  }, [id, API_BASE]);

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product) return <Loading />;

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Image Gallery */}
            <div className="p-8 bg-white flex items-center justify-center lg:sticky lg:top-0 h-fit">
              <div className="relative group overflow-hidden rounded-2xl bg-gray-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto max-h-[550px] object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/500?text=No+Image"; }}
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="p-8 lg:p-12 border-l border-gray-50">
              <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">
                Premium Collection
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 leading-tight">
                {product.name}
              </h1>

              <div className="mt-6 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-slate-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through font-medium">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-green-600 text-sm font-bold">Inclusive of all taxes</p>
              </div>

              <hr className="my-8 border-gray-100" />

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description || "No description available for this premium gadget."}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <TrustBadge icon={<FaTruck />} label="Free Delivery" />
                <TrustBadge icon={<FaLock />} label="Secure Payments" />
                <TrustBadge icon={<FaCheckCircle />} label="Premium Quality" />
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={() => buyNow(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                >
                  <FaBolt className="text-yellow-400" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper component for cleaner code
function TrustBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <span className="text-blue-600">{icon}</span>
      <span className="text-xs font-bold text-gray-700">{label}</span>
    </div>
  );
}

export default ProductDetail;
