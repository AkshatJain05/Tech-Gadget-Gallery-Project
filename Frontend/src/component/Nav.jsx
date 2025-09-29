import { useContext, useEffect, useState } from "react";
import { IoBagHandleSharp, IoCartOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaBarsStaggered, FaChevronRight } from "react-icons/fa6";
import { useNavigate, NavLink } from "react-router-dom";
import { ProductContext } from "../context/store.jsx";
import { CartContext } from "../context/CartContext.jsx";
import UserMenuAfterLogin from "./UserMenuAfterLogin";
import Search from "./Search.jsx";
import axios from "axios";

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Categories");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    user,
    logout,
    isLogin,
    loading: loadingUser,
  } = useContext(ProductContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoadingCategories(true);
    axios
      .get(`${API}/api/user/categories`)
      .then((res) => setCategories(res.data?.categories || []))
      .catch((err) => console.log(err))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    setCategoriesOpen(false);
    navigate(`/category/${category}`);
    setMobileOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileOpen(false);
  };

  // Modern Shimmer Skeleton Loader
  const Shimmer = ({ className }) => (
    <div
      className={`bg-gray-800 relative overflow-hidden rounded ${className}`}
    >
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-gray-800 via-gray-600/40 to-gray-800 animate-shimmer"></div>
      <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 1.5s infinite;
      }
    `}</style>
    </div>
  );

  if (loadingCategories || loadingUser) {
    return (
      <nav className="fixed w-full z-50 h-16 flex items-center justify-between px-4 md:px-12 lg:px-14 bg-gradient-to-br from-slate-900 to-gray-950 text-white shadow-lg">
        {/* Logo shimmer */}
        <Shimmer className="w-40 h-8 rounded-full" />
        <div className="flex gap-4 items-center">
          <Shimmer className="w-8 h-8 rounded-full" />
          <Shimmer className="w-20 h-8 rounded-full" />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="fixed w-full z-50 h-15 flex items-center justify-between px-4 md:px-12 lg:px-14 bg-gradient-to-br from-slate-900 to-gray-950 text-white shadow-lg">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <IoBagHandleSharp className="text-2xl md:text-4xl text-orange-400 hover:animate-pulse" />
          <p className="font-extrabold text-xl md:text-2xl xl:text-3xl bg-clip-text text-transparent bg-gradient-to-b from-orange-500 to-yellow-400">
            Tech Gadget Gallery
          </p>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${
                isActive ? "font-bold border-b-2 border-orange-500" : ""
              } hover:text-orange-400 hover:scale-105 transition-all duration-200`
            }
          >
            Home
          </NavLink>

          {/* Categories Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-3 py-2 rounded  hover:text-white shadow-lg hover:bg-gray-700  transition-all duration-200 transform hover:scale-105"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              {selectedCategory}{" "}
              <FaChevronRight
                className={`transition-transform duration-200 ${
                  categoriesOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {categoriesOpen && (
              <ul className="absolute top-full mt-2 w-48 bg-white text-black rounded shadow-xl py-2 opacity-100 visible transition-all duration-200">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`px-4 py-2 hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-400 hover:text-white cursor-pointer transition-all duration-200 rounded ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-white font-semibold shadow-inner"
                        : ""
                    }`}
                    onClick={() => handleSelect(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <NavLink
            to="/all-product"
            className={({ isActive }) =>
              `${
                isActive ? "font-bold border-b-2 border-orange-500" : ""
              } hover:text-orange-400 hover:scale-105 transition-all duration-200`
            }
          >
            All Products
          </NavLink>

          <Search />

          {/* Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer hover:scale-110 transition-transform duration-200 hover:shadow-lg hover:text-orange-400"
          >
            <IoCartOutline className="text-3xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 text-xs text-white bg-orange-500 w-5 h-5 rounded-full flex items-center justify-center text-[12px] shadow-lg ">
                {cartCount}
              </span>
            )}
          </div>

          {/* User Menu / Login */}
          {isLogin ? (
            <UserMenuAfterLogin
              name={user.userName}
              onLogout={handleLogout}
              onMyOrder="/my-orders"
            />
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-1 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full font-semibold hover:scale-105 hover:from-orange-500 hover:to-yellow-400 shadow-lg transition-all"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer hover:scale-110 transition-transform duration-200 hover:shadow-lg"
          >
            <IoCartOutline className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 text-xs text-white bg-orange-500 w-4 h-4 rounded-full flex items-center justify-center text-[12px] shadow-lg">
                {cartCount}
              </span>
            )}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? (
              <RxCross2 className="text-2xl text-white hover:text-orange-400 transition-colors duration-200" />
            ) : (
              <FaBarsStaggered className="text-xl hover:text-orange-400 transition-colors duration-200" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-15 right-0 w-3/4 h-full bg-gradient-to-br from-slate-900 to-gray-950 text-white shadow-xl flex flex-col items-start py-6 px-5 gap-4 text-sm transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `${
                isActive
                  ? "font-bold border-l-4 border-orange-500 pl-2 shadow-inner"
                  : ""
              } w-full py-2 hover:text-orange-400 hover:bg-gray-800 rounded transition-all duration-200`
            }
          >
            Home
          </NavLink>

          {/* Mobile Categories */}
          <div className="w-full">
            <button
              className="flex justify-between w-full px-3 py-2 hover:text-orange-400 hover:bg-gray-800 rounded transition-all duration-200 hover:scale-105"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              {selectedCategory}{" "}
              <FaChevronRight
                className={`${
                  categoriesOpen ? "rotate-90" : ""
                } transition-transform duration-200`}
              />
            </button>
            {categoriesOpen && (
              <ul className="w-full bg-white text-black rounded shadow-xl py-2">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`px-4 py-2 hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-400 hover:text-white cursor-pointer transition-all duration-200 rounded ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-white font-semibold shadow-inner"
                        : ""
                    }`}
                    onClick={() => handleSelect(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <NavLink
            to="/all-product"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `${
                isActive
                  ? "font-bold border-l-4 border-orange-500 pl-2 shadow-inner"
                  : ""
              } w-full py-2 hover:text-orange-400 hover:bg-gray-800 rounded transition-all duration-200`
            }
          >
            All Products
          </NavLink>

          {isLogin ? (
            <>
              <NavLink
                to="/my-orders"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2 hover:text-orange-400 hover:bg-gray-800 rounded transition-all duration-200"
              >
                My Orders
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-orange-500 hover:bg-orange-400 rounded transition-all font-semibold shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full py-2 bg-orange-500 hover:bg-orange-400 rounded transition-all font-semibold shadow-lg"
            >
              Login
            </button>
          )}

          <Search />
        </div>
      </nav>

      <div className="h-16"></div>

      {/* Shimmer Animation */}
      <style>{`
  .animate-skeleton {
    position: relative;
    overflow: hidden;
    background-color: #2d2d2d; /* base color */
  }

  .animate-skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(45, 45, 45, 0) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(45, 45, 45, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-150%);
    }
    100% {
      transform: translateX(150%);
    }
  }
`}</style>
    </>
  );
};

export default Nav;
