import  { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DummyOnlinePayment = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

   const location = useLocation();
  const amount = location.state?.amount || 0;

  const handlePayment = () => {
    setOpen(true);
  };

  const confirmPayment = () => {
    setOpen(false);
    alert("✅ Payment Successful! (Demo Only, No API)");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Tech Accessories Store</h1>
      <button
        onClick={handlePayment}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
      >
        Pay ₹{amount}
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Razorpay Checkout (Demo)</h2>
            <p className="mb-2">Amount: ₹{amount}</p>
            <p className="mb-2">Currency: INR</p>
            <p className="mb-2">Merchant: Tech Accessories Store</p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={()=>navigate("/checkout",{state:"Online"})}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Simulate Success
                
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default  DummyOnlinePayment;
;
