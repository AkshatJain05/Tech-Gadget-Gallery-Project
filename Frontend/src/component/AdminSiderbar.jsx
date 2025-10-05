import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaBoxOpen, FaPlus, FaUserShield, FaBars } from "react-icons/fa";
import { ProductContext } from "../context/store";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useContext(ProductContext);

  // Collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize(); // set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Add Product", path: "/admin/add-product", icon: <FaPlus /> },
    { name: "Order Status", path: "/admin/order-status", icon: <FaUserShield /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-slate-800 text-orange-400 min-h-screen transition-all duration-300 relative`}
      >
        {/* Hamburger button */}
        <button
          className="absolute top-4 right-[-20px] bg-orange-500 text-white p-2 rounded-full md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>

        {/* Logo */}
        {isOpen && (
          <div className="text-2xl font-bold text-center py-6 border-b border-slate-700">
            Admin
          </div>
        )}

        {/* Menu */}
        <ul className="mt-6 flex flex-col gap-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-1 text-lg rounded-lg mx-2 hover:bg-orange-500 hover:text-white transition
                 ${isActive ? "bg-orange-500 text-white" : ""}`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}

          {isOpen && (
            <button
              onClick={logout}
              className="w-fit p-1 bg-red-500 rounded text-white my-4 hover:bg-red-400 font-bold ml-3 md:ml-5 border-b border-slate-700"
            >
              Logout
            </button>
          )}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-1 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
