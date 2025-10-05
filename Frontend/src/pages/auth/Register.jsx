import toast, { Toaster } from "react-hot-toast";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import ScrollAnimation from "../../component/ScollerAnimation";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register() {
  const [registerData, setRegisterData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const submitRegisterForm = async (e) => {
    e.preventDefault();

    if (!registerData.userName || !registerData.email || !registerData.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      toast.loading("Creating account...");
      const response = await axios.post(`${API}/api/auth/register`, registerData);
      toast.dismiss();
      toast.success("Sign Up Successful!");
      navigate("/login");
      setRegisterData({ userName: "", email: "", password: "" });
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <div className="min-h-[90vh] flex justify-center items-center px-4 sm:px-8">
        <ScrollAnimation from="bottom">
          <form
            onSubmit={submitRegisterForm}
            className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-2xl px-6 sm:px-8 py-12 text-center space-y-6"
          >
            <h1 className="text-3xl font-semibold text-white">Sign Up</h1>
            <p className="text-gray-300 text-sm">Please sign up to continue</p>

            {/* Name Input */}
            <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-700 rounded-full overflow-hidden px-4 gap-3">
              <FaRegUser className="text-gray-800 text-xl" />
              <input
                type="text"
                name="userName"
                value={registerData.userName}
                onChange={onChangeHandler}
                autoComplete="name"
                placeholder="Enter Name"
                className="bg-gray-50 text-black placeholder-gray-500 outline-none w-full h-full text-sm"
                required
              />
            </div>

            {/* Email Input */}
            <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-700 rounded-full overflow-hidden px-4 gap-3">
              <MdOutlineMail className="text-gray-800 text-xl" />
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={onChangeHandler}
                autoComplete="email"
                placeholder="Email id"
                className="bg-gray-50 text-black placeholder-gray-500 outline-none w-full h-full text-sm"
                required
              />
            </div>

            {/* Password Input with Eye */}
            <div className="relative flex items-center w-full h-12 bg-gray-50 border border-gray-700 rounded-full overflow-hidden px-4 gap-3">
              <RiLockPasswordLine className="text-gray-800 text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={registerData.password}
                onChange={onChangeHandler}
                autoComplete="new-password"
                placeholder="Password"
                className="bg-gray-50 text-black placeholder-gray-500 outline-none w-full h-full text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 text-gray-900 transition"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button className="w-full h-12 rounded-full bg-slate-900 hover:bg-gray-900 text-white font-medium text-lg transition border border-white">
              Sign Up
            </button>

            <p className="text-gray-400 text-sm mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Login
              </Link>
            </p>
          </form>
        </ScrollAnimation>
      </div>
    </>
  );
}

export default Register;
