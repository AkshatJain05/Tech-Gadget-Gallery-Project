import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSiderbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen" >
      <AdminSidebar />
      <main className="flex-1 p-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
