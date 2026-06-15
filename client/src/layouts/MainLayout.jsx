import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useState, useEffect } from "react";

const MainLayout = () => {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isStockDetailsMobile = isMobile && pathname.startsWith("/stocks/");

  return (
    <div className="app-layout">
      {!isStockDetailsMobile && <Navbar />}

      <main className={`main-content ${isStockDetailsMobile ? "no-navbar-padding" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;