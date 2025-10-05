import { useContext, useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import ScrollAnimation from "../../component/ScollerAnimation";
import { ProductContext } from "../../context/store";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(ProductContext);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(loginForm.email, loginForm.password);
    navigate("/"); // Navigate after login
  };

  return (
    <div className="min-h-[70vh] flex justify-center items-center px-4 sm:px-8">
      <ScrollAnimation from="bottom">
        <form
          onSubmit={handleLogin}
          className="max-w-md w-full bg-gradient-to-bl from-slate-950 to-slate-800  rounded-2xl shadow-2xl px-8 py-10 text-center space-y-6"
        >
          <h1 className="text-3xl font-semibold text-white">Login</h1>
          <p className="text-gray-300 text-sm">Please sign in to continue</p>

          {/* Email Input */}
          <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-700 rounded-full overflow-hidden px-3 gap-2">
            <MdOutlineMail className="text-gray-800 text-xl" />
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={onChangeHandler}
              placeholder="Email id"
              className="bg-transparent text-black placeholder-gray-500 outline-none w-full h-full text-sm"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center w-full h-12 bg-gray-50 border border-gray-700 rounded-full overflow-hidden px-3 gap-2">
            <RiLockPasswordLine className="text-gray-700 text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginForm.password}
              onChange={onChangeHandler}
              placeholder="Password"
              className="bg-transparent text-black placeholder-gray-500 outline-none w-full h-full pr-10 text-sm"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 text-gray-800  transition"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-slate-900 hover:bg-gray-900 text-white font-medium text-lg transition border-1 border-white"
          >
            Login
          </button>

          <p className="text-gray-400 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </ScrollAnimation>
    </div>
  );
}

export default Login;
