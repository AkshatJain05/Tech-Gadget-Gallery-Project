import { Outlet } from "react-router-dom";
// import Nav from "../components/Navbar";
import Footer from "../Footer";
import Nav from "../Nav";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
       
      <Nav/>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
