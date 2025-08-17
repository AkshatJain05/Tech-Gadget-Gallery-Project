import  { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMenuAfterLogin = ({ name = "John Doe", onLogout, onMyOrder }) => {
  const [open, setOpen] = useState(false);
  const firstLetter = name.charAt(0).toUpperCase();
  const navigate = useNavigate();

return (
    <div className="relative inline-block">
        <div
            onClick={()=> setOpen(!open)}
            onMouseEnter={() => setOpen(true)}
            // onMouseLeave={() => setOpen(false)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 text-slate-950 flex items-center justify-center text-2xl  font-semibold cursor-pointer shadow-md transition-shadow duration-200"
        >
            {firstLetter}
        </div>
        {open && (
            <div
                className="absolute top-12 right-0 min-w-[180px] bg-slate-950 rounded shadow-lg py-4 z-50 animate-fadeIn"
                // onMouseEnter={() => setOpen(true)}
                // onMouseLeave={() => setOpen(false)}
            >
                <div className="px-6 py-2 font-bold text-white border-b border-gray-100 mb-2 text-base md:text-lg">
                    {name}
                </div>
                <div
                    className="px-6 py-2 cursor-pointer text-white border-b-1 hover:bg-orange-400 transition-colors duration-200 text-sm md:text-base"
                    onClick={()=>navigate(onMyOrder)}
                    // onMouseDown={e => e.preventDefault()}
                >
                    My Order
                </div>
                <div
                    className="px-6 py-2 cursor-pointer text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm md:text-base font-semibold font-xl"
                    onClick={onLogout}
                    // onMouseDown={e => e.preventDefault()}
                >
                    Logout
                </div>
            </div>
        )}
    </div>
);
};

export default UserMenuAfterLogin;