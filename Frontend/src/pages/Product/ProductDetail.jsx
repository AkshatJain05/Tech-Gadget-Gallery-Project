import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../component/Loding";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const { addToCart, buyNow } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`/api/user/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <Loading />;

  // Calculate discount %
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-auto max-h-[500px] object-contain"
        />
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-gray-600 mt-3">{product.description}</p>

        {/* Price + Discount */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-3xl font-bold text-blue-600">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-gray-400 line-through text-lg">
                ₹{product.originalPrice}
              </span>
              <span className="text-green-600 font-semibold text-lg">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Colors
        {product.color && product.color.length > 0 && (
          <div className="mt-6">
            <p className="text-gray-700 font-semibold mb-2">Available Colors:</p>
            <div className="flex gap-4">
              {product.color.map((color, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm mt-1">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => addToCart(product)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={() => buyNow(product)}
            className="bg-slate-950 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
