import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "motion/react";


export default function AdminProductList({ products = [], onDelete }) {

  return (
    <div className="p-2 sm:p-4 flex flex-col gap-3 w-full max-w-2xl mx-auto">
 
      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No products available.</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow hover:shadow-lg transition p-3 sm:p-4 gap-3 sm:gap-4"
          >
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-24 h-24 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex-1 w-full sm:ml-3 flex flex-col justify-between">
              <h3 className="text-base sm:text-sm font-semibold text-slate-800 break-words leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 break-words">{product.category}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 text-xs gap-1">
                <span className="font-bold text-orange-500">{product.price}</span>
                <span
                  className={ `relative md:bottom-5 px-2 py-1 botton-5 rounded-full text-xs mt-1 sm:mt-0 ${
                    product.stockQuantity > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            {/* Action Buttons */}
            <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-2 justify-end items-center">
              {/* <button
                onClick={() => onEdit(product)}
                className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition text-base sm:text-xs"
                aria-label="Edit"
              >
                <FaEdit />
              </button> */}
              <button
                onClick={() => onDelete(product)}
                className="flex items-center justify-center bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition text-base sm:text-xs"
                aria-label="Delete"
              >
                <FaTrash />
              </button>
            </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
