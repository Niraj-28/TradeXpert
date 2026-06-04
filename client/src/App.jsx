import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
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