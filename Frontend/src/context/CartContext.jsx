import  { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load guest cart from localStorage instantly
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL

  /** Fetch cart from backend (for logged-in users) */
  const fetchServerCart = useCallback(async () => {
    try {
      const res = await axios.post(
        `${API}/api/user/cart`,
        {},
        { withCredentials: true }
      );
      if (Array.isArray(res.data)) {
        setCart(res.data);
        setIsLoggedIn(true);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  /** Merge local cart into backend cart on login */
  const mergeCart = useCallback(async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (localCart.length > 0) {
        await axios.post(
          `${API}/api/user/merge-cart`,
          { items: localCart },
          { withCredentials: true }
        );
        localStorage.removeItem("cart");
      }
      await fetchServerCart();
    } catch (err) {
      console.error("Cart merge failed:", err);
    }
  }, [fetchServerCart]);

  /** Save guest cart to localStorage */
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  /** On first load → try backend cart, else use localStorage */
  useEffect(() => {
    const initCart = async () => {
      try {
        await fetchServerCart();
      } catch {
        // If not logged in, use localStorage (already set in useState)
      }
    };
    initCart();
  }, [fetchServerCart]);

  /** Add to cart */
  const addToCart = async (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product._id, quantity, product }];
    });

    if (isLoggedIn) {
      await axios.post(
        `${API}/api/user/add-to-cart`,
        { productId: product._id, quantity },
        { withCredentials: true }
      );
      await fetchServerCart();
    }
  };

  /** Remove from cart */
  const removeFromCart = async (productId) => {
    if (isLoggedIn) {
      await axios.post(
        `${API}/api/user/remove-from-cart`,
        { productId },
        { withCredentials: true }
      );
      await fetchServerCart();
    } else {
       setCart((prev) =>
        prev.filter((item) => {
          const id = (item.product?._id || item.productId);
          return id !== productId;
        })
      );
  }
}

  // /** Buy Now */
  // const buyNow = (product, quantity = 1) => {
  //   localStorage.setItem(
  //     "checkoutItem",
  //     JSON.stringify([{ productId: product._id, quantity, product }])
  //   );
  //   navigate("/checkout");
  // };

  // buy Now 
  const buyNow = async (product,quantity=1)=>
     { localStorage.setItem("checkoutItem",JSON.stringify([{ productId: product._id, quantity, product }]))
   if (isLoggedIn) { 
    // If logged in, go to checkout directly 
    navigate("/checkout") } 
    else { 
    // If guest, go to login with redirect
     navigate("/checkout") } }

  /** Cart Count */
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoggedIn,
        addToCart,
        removeFromCart,
        buyNow,
        mergeCart,
        fetchServerCart,
        setIsLoggedIn,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
