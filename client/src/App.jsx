import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
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