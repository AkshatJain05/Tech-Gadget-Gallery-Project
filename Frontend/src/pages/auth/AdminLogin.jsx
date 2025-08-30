import { useContext, useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import ScrollAnimation from "../../component/ScollerAnimation";
import { ProductContext } from "../../context/store";
import { Link } from "react-router-dom";

function AdminLogin() {
//   const navigate = useNavigate();
  const { adminLogin } = useContext(ProductContext);
   
  const [loginForm, setLoginForm] = useState({
    email: "admin@123",
    password: "123456",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
      e.preventDefault();
      await adminLogin(loginForm.email,loginForm.password);
    //   navigate("/admin/dashboard")
  };

  return (
    <>
      <div className="h-[70vh] w-full flex justify-center items-center px-8 my-10">
        <ScrollAnimation from="bottom">
          <form
            onSubmit={handleLogin}
            className="max-w-96 w-full text-center border border-gray-900/60 rounded-2xl px-8 bg-slate-900 shadow-2xl shadow-black"
          >
            <h1 className="text-white text-3xl mt-10 font-medium">Admin Login</h1>
            <p className="text-gray-200 text-sm mt-2">
              Please sign in to continue
            </p>
            <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-3 gap-2">
              <MdOutlineMail className="text-2xl text-gray-500" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChangeHandler}
                placeholder="Email id"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-3 gap-2">
              <RiLockPasswordLine className="text-2xl text-gray-500" />
              <input
                type="password"
                value={password}
                name="password"
                onChange={onChangeHandler}
                placeholder="Password"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                required
              />
            </div>
            <div className="mt-5 text-left text-indigo-500">
              {/* <Link className="text-sm" to="/forget-password">
                Forgot password?
              </Link> */}
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-11 rounded-full text-white bg-slate-900 border-1 border-white hover:opacity-90 transition-opacity"
            >
              Login
            </button>
            {/* <p className="text-gray-300 text-sm mt-3 mb-11">
              Don’t have an account?{" "}
              <Link className="text-indigo-400" to="/register">
                Sign up
              </Link>
            </p> */}

            <p className="h-9"></p>
          </form>
        </ScrollAnimation>
      </div>
    </>
  );
}

export default AdminLogin;
