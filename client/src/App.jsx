import { useAuth } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";

import AppRoutes from "./routes/AppRoutes";

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {user && <Navbar />}
      <AppRoutes />
    </div>
  );
}

export default App;
