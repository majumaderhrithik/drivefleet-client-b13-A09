import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

const MainLayout = () => (
  <div className="layout">
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
    <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: "system-ui, sans-serif", fontSize: 14 } }} />
  </div>
);
export default MainLayout;
