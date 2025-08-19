import toast, { Toaster } from "react-hot-toast";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import ScrollAnimation from "../../component/ScollerAnimation";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [registerData, setRegisterData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL
  const onChandleHandler = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => setRegisterData({ ...prev, [name]: value }));
  };

  const sumbitRegisterForm = async (e) => {
    e.preventDefault();
    if (
      !registerData.userName ||
      !registerData.email ||
      !registerData.password
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      toast.loading("Creating account...");

      //  Replace with your actual backend API
      const response = await axios.post(
        `${API}/api/auth/register`,
        registerData
      );

      toast.dismiss(); // remove loading
      toast.success("Sign Up Successful!");
      navigate("/login")

      console.log("Response:", response.data);

      // Clear form
      setRegisterData({ userName: "", email: "", password: "" });
    } catch (error) {
      toast.dismiss();
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <div className="h-[80vh] w-full flex justify-center items-center my-10 px-8">
        <ScrollAnimation from="bottom">
        <form
          onSubmit={sumbitRegisterForm}
          className="max-w-96 w-full text-center border border-gray-900/60 rounded-2xl px-8 bg-black-50 opacity-98 shadow-2xl shadow-black bg-gradient-to-bl from-slate-950 to-slate-800 "
        >
          <h1 className="text-white text-3xl mt-10 font-medium">Sign Up</h1>
          <p className="text-gray-200 text-sm mt-2">
            Please sign up to continue
          </p>

          <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <FaRegUser className="text-xl text-gray-500" />
            <input
              type="text"
              name="userName"
              onChange={onChandleHandler}
              placeholder="Enter Name"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <MdOutlineMail className="text-2xl text-gray-500" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              onChange={onChandleHandler}
              placeholder="Email id"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <RiLockPasswordLine className="text-2xl text-gray-500" />
            <input
              type="password"
              onChange={onChandleHandler}
              name="password"
              autoComplete="new-password"
              placeholder="Password"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <button className="mt-5 w-full h-11 rounded-full text-white bg-slate-900 hover:opacity-90 transition-opacity border-1 border-white">
            sign up
          </button>
          <p className="text-gray-300 text-sm mt-3 mb-11">
            Do have an account?{" "}
            <Link className="text-indigo-500" to="/login">
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
