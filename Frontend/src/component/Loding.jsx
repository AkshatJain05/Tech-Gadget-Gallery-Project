import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    // min-h-[400px] ensures the page doesn't collapse while loading
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 transition-opacity duration-300">
      
      {/* Container for the Spinner Layers */}
      <div className="relative flex items-center justify-center mb-4">
        {/* The Track: A subtle background ring for a high-end feel */}
        <FaSpinner 
          className="text-gray-100 text-6xl" 
        />
        {/* The Actual Spinner: Absolute positioned to sit perfectly on top */}
        <FaSpinner 
          className="animate-spin text-blue-600 text-6xl absolute z-10 drop-shadow-sm" 
        />
      </div>

      {/* Text Elements */}
      <div className="text-center">
        <h3 className="text-gray-800 font-semibold text-xl tracking-tight">
          Fetching Products
        </h3>
        <p className="text-gray-400 text-sm mt-1 animate-pulse">
          Just a moment while we prepare your shop...
        </p>
      </div>
    </div>
  );
};

export default Loading;