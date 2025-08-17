import { useState } from "react";
import axios from "axios";
import { FiPackage, FiImage } from "react-icons/fi";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    imageUrl: "",
    stockQuantity: "",
    colorNumber: "",
    color: "",
    bestSeller: false, // Added bestSeller
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Predefined categories
  const categories = [
    "Chargers",
    "Smartwatches",
    "Headphones",
    "Mobile Covers",
    "Stands",
    "Cables",
    "Power Banks",
    "Earbuds"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "color" ? value.split(",").map((c) => c.trim()) : value,
    }));
  };

  const formhandleChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imageUrl: file }));
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const handler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "color" && Array.isArray(value)) {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    try {
      await axios.post("/api/host/add-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("✅ Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        imageUrl: "",
        stockQuantity: "",
        colorNumber: "",
        color: "",
        bestSeller: false, // reset
      });
      setPreviewImage(null);
    } catch (err) {
      setErrorMsg("❌ Failed to add product.");
    }
    setLoading(false);
  };
 
   console.log(formData)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-3 py-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <FiPackage className="text-orange-500 text-4xl mr-3" />
          <h2 className="text-3xl font-extrabold text-orange-600 tracking-tight">
            Add New Product
          </h2>
        </div>

        <form onSubmit={handler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Product Name"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Price"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Original Price
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                required
                placeholder="Original Price"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                placeholder="Stock Quantity"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* Color Number */}
            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Color Number
              </label>
              <input
                type="text"
                name="colorNumber"
                value={formData.colorNumber}
                onChange={handleChange}
                required
                placeholder="Color Number"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* Best Seller Checkbox */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="bestSeller"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bestSeller: e.target.checked,
                  }))
                }
                className="h-5 w-5 text-orange-500 focus:ring-orange-400 border-slate-300 rounded"
              />
              <label htmlFor="bestSeller" className="font-semibold text-slate-700">
                Mark as Best Seller
              </label>
            </div>

            {/* Color */}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-2 text-slate-700">
                Color (comma separated)
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                placeholder="Example: Red, Blue, Black"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-2 text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter product description..."
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-y min-h-[120px]"
              />
            </div>

            {/* Product Image Upload */}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-3 text-slate-700 text-center">
                Product Image
              </label>
              <div className="flex justify-center">
                <div
                  className="border-2 border-dashed border-orange-400 rounded-xl flex items-center justify-center cursor-pointer hover:bg-orange-50 transition h-50 w-70 p-1"
                  onClick={() =>
                    document.getElementById("productImageInput").click()
                  }
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="rounded-lg shadow-md w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-slate-500">
                      <FiImage className="text-orange-500 text-5xl mb-2" />
                      <p className="font-medium">Click or drag to upload</p>
                      <span className="text-sm text-slate-400">
                        Max size: 5MB • JPG/PNG
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                id="productImageInput"
                name="imageUrl"
                className="hidden"
                onChange={formhandleChange}
                required
                accept="image/*"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center mt-6">
            <button
              type="submit"
              className="w-full md:w-1/2 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
            {successMsg && (
              <p className="mt-4 text-green-600 font-semibold">{successMsg}</p>
            )}
            {errorMsg && (
              <p className="mt-4 text-red-600 font-semibold">{errorMsg}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
