import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";

import Markets from "./pages/Markets/Markets";

import Portfolio from "./pages/Portfolio/Portfolio";

import Watchlist from "./pages/Watchlist/Watchlist";

import Trading from "./pages/Trading/Trading";

import Analytics from "./pages/Analytics/Analytics";

import News from "./pages/News/News";

import Navbar from "./components/Navbar/Navbar";

function App() {

  return (

    <div className="min-h-screen bg-[#F4F7FB]">

      {/* GLOBAL NAVBAR */}

      <Navbar />

      {/* ROUTES */}

      <Routes>

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
            />
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* MARKETS */}

        <Route
          path="/markets"
          element={<Markets />}
        />

        {/* PORTFOLIO */}

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        {/* WATCHLIST */}

        <Route
          path="/watchlist"
          element={<Watchlist />}
        />

        {/* TRADING */}

        <Route
          path="/trading"
          element={<Trading />}
        />

        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        {/* NEWS */}

        <Route
          path="/news"
          element={<News />}
        />

      </Routes>

    </div>

  );

}

export default App;