import { createContext, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
export const ProductContext = createContext();

export const ContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    axios
      .get(`${API}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setIsLogin(true);
      })
      .catch((err) => {
        setUser(null);
        setIsLogin(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      toast.loading("login account...");
      const response = await axios.post(
        `${API}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.dismiss();
      toast.success("Login Successful!");
      setUser(response.data.user);
      setIsLogin(true);
      console.log(user);
      if (response.data) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        if (localCart.length > 0) {
          await axios.post(
            `${API}/api/user/merge-cart`,
            { localCart },
            { withCredentials: true }
          );

          localStorage.removeItem("cart"); // Clear guest cart
        }
      }
      navigate("/");
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

  const logout = () => {
    axios
      .post(
        `${API}/api/auth/logout`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        toast.dismiss();
        // console.log(res.data);
        setIsLogin(false);
        setUser(null);
        toast.success("Logout Successfully");
        navigate("/");
        console.log("user", user);
      })
      .catch((err) => {
        toast.dismiss();
        if (err) {
          toast.error(err.message);
        } else {
          toast.error("Something is wrong");
        }
      });
  };




    const adminLogin = async (email, password) => {
    try {
      toast.loading("login account...");
      const response = await axios.post(
        `${API}/api/auth/admin/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.dismiss();
      toast.success("Admin Login Successful!");
      setUser(response.data.user);
      // console.log(user);
      navigate("/admin/dashboard");
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

  // console.log(user);

  return (
    <ProductContext.Provider
      value={{ user, setUser, loading, isLogin, setLoading, login, logout,adminLogin}}
    >
      {children}
    </ProductContext.Provider>
  );
};
