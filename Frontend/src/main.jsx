import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./context/store.jsx";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                marginTop: "60px",
                fontSize: "1.1rem",
                padding: "0.9rem 1.2rem",
                minWidth: "220px",
                borderRadius: "0.5rem",
              },
            }}
            reverseOrder={false}
          />
        </CartProvider>
      </ContextProvider>
    </BrowserRouter>
  </StrictMode>
);
