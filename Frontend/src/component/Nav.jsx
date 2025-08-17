import { useContext, useEffect, useState } from "react";
import { IoBagHandleSharp } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaBarsStaggered } from "react-icons/fa6";
import { useNavigate, NavLink } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { ProductContext } from "../context/store.jsx";
import { CartContext } from "../context/CartContext.jsx";
import UserMenuAfterLogin from "./UserMenuAfterLogin";
import Loading from "./Loding";
import Search from "./Search.jsx";
import axios from "axios";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Categories");
  const [categories, setCategories] = useState([]);
  const { user, logout, isLogin, loading } = useContext(ProductContext);
  const { cartCount } = useContext(CartContext);

  useEffect(() => {
    axios
      .get("/api/user/categories")
      .then((res) => {
        setCategories(res.data?.categories);
      })
      .catch((err) => {
        if (err) {
          console.log("Error", err.message);
        }
        console.log("Something is Wrong in Categories");
      });
  }, []);

  // const categori = [
  //   "Chargers",
  //   "Smartwatches",
  //   "Headphones",
  //   "Mobile Covers",
  //   "Phone Stands",
  //   "Power Banks",
  //   "USB Cables",
  //   "Bluetooth Speakers",
  //   "Screen Protectors",
  //   "Laptop Accessories",
  //   "Gaming Accessories",
  //   "Car Mobile Holders",
  // ];

  const handleSelect = (category) => {
    setSelected(category);
    setIsOpen(false);
    navigate(`/category/${category}`)
  };

  const handleLogin = () => {
    navigate("/login");
    setOpen(false);
  };

  const handlelogout = async () => {
    await logout();
    navigate("/");
    setOpen(false);
  };

  const navigate = useNavigate();

  if (loading) {
    return  <Loading />
  }

  return (
    <>
      <nav className="fixed w-full z-10 h-16 flex items-center justify-between px-4 md:px-12 lg:px-12 xl:px-14 py-3 border-b border-gray-300   transition-all bg-gradient-to-bl from-slate-950 to-gray-950 text-white">
        <NavLink href="" className="flex items-center gap-1">
          {/* <img src={logo} className="h-14"></img> */}
          <IoBagHandleSharp className="text-2xl md:text-4xl text-orange-400" />
          <p className="font-bold text-xl md:text-2xl  xl:text-3xl bg-clip-text text-transparent bg-gradient-to-b from-orange-500 to-yellow-400">
            Tech Gadget Gallery
          </p>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${
                isActive ? " font-bold px-1 py-0.5 rounded border-1" : null
              } hover:font-bold transition-all`
            }
          >
            Home
          </NavLink>
          {/* <NavLink to="/categories">Categories</NavLink> */}
          <div className="flex flex-col w-auto px-4 relative z-3 bg-transparent cursor-pointer">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left px-4 pr-2 py-2  rounded   focus:outline-none cursor-pointer"
            >
              <span>{selected}</span>
              <FaChevronRight
                className={`text-sm relative top-1.5 inline float-right transition-transform duration-200 ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              />
            </button>

            {isOpen && (
              <ul className="w-full  bg-white text-black border-1 rounded shadow-md mt-1 py-2 absolute top-10 cursor-pointer">
                {categories.map((categorie) => (
                  <li
                    key={categorie}
                    className="px-4 py-2 hover:bg-orange-500 hover:text-white cursor-pointer"
                    onClick={()=>handleSelect(categorie)}
                  >
                    {categorie}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <NavLink
            to="/all-product"
            className={({ isActive }) =>
              `${
                isActive ? " font-bold px-1 py-0.5 rounded border-1" : null
              } hover:font-bold transition-all`
            }
          >
            All Product
          </NavLink>

          <Search />

          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <IoCartOutline className="text-3xl " />
            {cartCount > 0 && (
              <button className="absolute -top-1 -right-2 text-xs text-white bg-orange-500 w-[18px] h-[18px] rounded-full">
                {cartCount}
              </button>
            )}
          </div>

          {isLogin ? (
            <UserMenuAfterLogin
              name={user.userName}
              onLogout={handlelogout}
              onMyOrder={"/my-orders"}
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer px-4 py-1 bg-gradient-to-b from-orange-600 to-orange-400 hover:border-1 border-yellow-800 transition font-bold text-white rounded-full"
            >
              login
            </button>
          )}
        </div>

        <div className="flex gap-5 lg:hidden">
          <div
            onClick={() => navigate("/cart")}
            className="lg:hidden relative cursor-pointer "
          >
            <IoCartOutline className="text-2xl " />
            {cartCount > 0 && (
              <button className="absolute -top-1 -right-2 text-xs text-white bg-orange-500 w-[16px] h-[16px] rounded-full">
                {cartCount}
              </button>
            )}
          </div>

          <button
            onClick={() => (open ? setOpen(false) : setOpen(true))}
            aria-label="Menu"
            className="lg:hidden"
          >
            {/* Menu Icon */}
            {open ? (
              <RxCross2 className="text-xl" />
            ) : (
              <FaBarsStaggered className="text-xl" />
            )}
          </button>
        </div>
        {/* Mobile Menu */}

        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[53px] left-0 w-full  bg-gradient-to-bl from-slate-950 to-gray-950 text-white shadow-md py-4 flex-col items-center border-t-1 gap-2 px-5 text-sm lg:hidden`}
        >
          <NavLink
            onClick={() => setOpen(false)}
            to="/"
            className={({ isActive }) =>
              `${
                isActive ? " font-bold px-1 py-1 rounded border-1" : null
              } hover:font-bold transition-all block my-1`
            }
          >
            Home
          </NavLink>
          <div className="flex flex-col w-auto  relative z-3 bg-transparent">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left px-0 pr-2 py-2  rounded  hover:bg-gray-800 focus:outline-none"
            >
              <span>{selected}</span>
              <FaChevronRight
                className={`text-sm relative top-1  inline float-right transition-transform duration-200 ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              />
            </button>

            {isOpen && (
              <ul className="w-full   border-1 rounded shadow-md mt-1 py-2">
                {categories.map((categorie) => (
                  <li
                    key={categorie}
                    className="px-4 py-2 hover:bg-orange-500 hover:text-white cursor-pointer"
                    onClick={() => handleSelect(categorie)}
                  >
                    {categorie}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <NavLink
            to="/all-product"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${
                isActive ? " font-bold px-1 py-1 rounded border-1" : null
              } hover:font-bold transition-all block my-1`
            }
          >
            All product
          </NavLink>

          {isLogin ? (
            <>
              <NavLink
                to="/my-orders"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${
                    isActive ? " font-bold px-1 py-1 rounded border-1" : null
                  } hover:font-bold transition-all block my-1`
                }
              >
                My order
              </NavLink>
              <button
                onClick={handlelogout}
                className="cursor-pointer px-4 py-1 mt-2 bg-orange-500 hover:bg-orange-400 transition text-white rounded-full text-sm font-semibold"
              >
                logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="cursor-pointer px-4 py-1 mt-2 bg-orange-500 hover:bg-orange-400 transition text-white rounded-full text-sm font-semibold"
            >
              Login
            </button>
          )}
          <Search />
        </div>
      </nav>
      <div className="h-15 bg-red-600"></div>
    </>
  );
};

export default Nav;
