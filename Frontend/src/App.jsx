import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import CartPage from "./pages/Product/CartPage.jsx";
import { Routes, Route } from "react-router-dom";
import AllProduct from "./pages/Product/AllProduct.jsx";
import ProductDetail from "./pages/Product/ProductDetail.jsx";
import SearchProduct from "./pages/Product/SearchProduct.jsx";
import CheckoutPage from "./pages/Product/CheckoutPage.jsx";
import OrderSuccess from "./pages/Product/OrderSuccess.jsx";
import MyOrders from "./pages/Product/MyOrder.jsx";
import CategoryProducts from "./pages/Product/CategoryProducts.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import UserLayout from "./component/UI/UserUi.jsx";
import AdminLayout from "./component/UI/AdminLayout.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import AdminDashboardUI from "./pages/admin/AdminDashboard.jsx";
import AdminOrderList from "./pages/admin/AdminOrderList.jsx";
import AdminRoute from "./routes/AdminRoutes.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminLogin from "./pages/auth/AdminLogin.jsx";
import NotFound from "./component/NotFound.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* User without login */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/all-product" element={<AllProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchProduct />} />
          <Route path="/category/:category" element={<CategoryProducts />} />
          <Route path="/cart" element={<CartPage />} />

           {/* After Login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />}></Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardUI />}></Route>
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<ProductManagement />}></Route>
            <Route path="order-status" element={<AdminOrderList />}></Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </>
  );
}

export default App;
