import axios from "axios";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollAnimation from "../../component/ScollerAnimation";
import Loading from "../../component/Loding";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function AllProduct() {
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
   
  const {addToCart,buyNow}= useContext(CartContext)

  useEffect(() => {
    axios
      .get("/api/user/get-all-product", {
        withCredentials: true,
      })
      .then((res) => {
        setAllProduct(res.data.productAllData);
        setLoading(false);
      }).catch((err)=>{
        if(err){
            console.log("Error: ",err.data?.message);
        }
        console.log("Something is wrong")
      })
  }, []);

   if(loading){
    return <Loading/>
   }

  return <>
    <div className="m-6 w-full text-center text-3xl font-bold overflow-hidden"> All Product</div>
    <div className="  p-4 flex justify-center gap-5 items-center px-3 sm:px-10 lg:px-26 py-6 pb-13">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {allProduct.map((product
) => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <ScrollAnimation   key={product._id} from="bottom">
               
            <div
            
              className="bg-white rounded-xl shadow-xl shadow-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden border-sm border-gray-200 flex flex-col m-1"
            >
               <Link to={`/product/${product._id}`}>
              {/* Image */}
              <div className="relative w-full h-38 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-semibold px-1 py-1 rounded-lg opacity-90 ">
                    {discount}% OFF
                  </span>
                )}
              </div>
              </Link>
              {/* Info */}
              
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/product/${product._id}`}>
                <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                  {product.name}
                </h2>
                <div className="mt-1">
                  <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-500 text-sm line-through ml-2">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                </Link>
                 
                {/* Buttons */}
                <div className="flex gap-2 mt-auto pt-3">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-bl from-slate-950 to-gray-950 hover:bg-blue-600 text-white py-1 px-1 rounded-lg text-sm  font-semibold active:scale-[0.95] transition-all cursor-pointer"
                  >
                    <FaShoppingCart /> Cart
                  </button>
                  <button
                    onClick={() => buyNow(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-bl from-blue-950 to-blue-900  hover:bg-green-600 text-white py-1 px-1 rounded-lg text-sm  font-semibold active:scale-[0.95] transition-all cursor-pointer"
                  >
                    <FaCreditCard /> Buy
                  </button>
                </div>
              </div>
            </div>
            </ScrollAnimation>
            
          );
        })}
      </div>
    </div>
  </>;
}
export default AllProduct;
