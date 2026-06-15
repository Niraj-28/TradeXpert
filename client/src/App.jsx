import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Dynamically update document title based on pathname
    let title = "TradeXpert - Virtual Trading Simulator";
    const path = pathname.toLowerCase();
    
    if (path === "/") {
      title = "TradeXpert - Virtual Trading Simulator";
    } else if (path === "/markets") {
      title = "Markets | TradeXpert";
    } else if (path === "/portfolio") {
      title = "Portfolio | TradeXpert";
    } else if (path === "/watchlist") {
      title = "Watchlist | TradeXpert";
    } else if (path === "/orders") {
      title = "Orders | TradeXpert";
    } else if (path === "/news") {
      title = "News & Market Insights | TradeXpert";
    } else if (path === "/profile") {
      title = "Profile | TradeXpert";
    } else if (path === "/login") {
      title = "Sign In | TradeXpert";
    } else if (path === "/register") {
      title = "Sign Up | TradeXpert";
    } else if (path === "/reset-password") {
      title = "Reset Password | TradeXpert";
    } else if (path.startsWith("/stocks/")) {
      const symbol = pathname.split("/").pop().toUpperCase();
      title = `${symbol} Stock Price & Live Chart | TradeXpert`;
    } else if (path.startsWith("/resources/")) {
      const resource = pathname.split("/").pop().replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
      title = `${resource} | TradeXpert`;
    }
    
    document.title = title;
  }, [pathname]);

  return (
    <>
      <AppRoutes />
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: "#1e293b",
          color: "#fff",
          borderRadius: "14px",
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
        }
      }} />
    </>
  );
}

export default App;