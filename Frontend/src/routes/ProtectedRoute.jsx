import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ProductContext } from "../context/store";
import Loading from "../component/Loding";

export default function ProtectedRoute() {
  const { user, loading } = useContext(ProductContext);

  if (loading) return <Loading/>

  if (!user) return <Navigate to="/login" replace />; 

  return <Outlet />; 
}
