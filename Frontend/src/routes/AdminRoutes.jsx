import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ProductContext } from "../context/store";
import Loading from "../component/Loding";

export default function AdminRoute() {
  const { user, loading } = useContext(ProductContext);

  // Wait until user is fetched
  if (loading) return <Loading/>;
 
  console.log(user)
  // If user is not admin, redirect
  if (!user?.isAdmin) return <Navigate to="/admin/login" replace />;

  // Render admin pages
  return <Outlet />;
}
