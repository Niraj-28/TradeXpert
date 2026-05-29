import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import MarketsPage from "../pages/Markets/MarketsPage";
import Portfolio from "../pages/Portfolio/Portfolio";
import Trading from "../pages/Trading/Trading";
import Watchlist from "../pages/Watchlist/Watchlist";
import News from "../pages/News/News";
import Profile from "../pages/Profile/Profile";

const AppRoutes = () => {
  return (
    <Routes>

      {/* DEFAULT REDIRECT */}
      <Route
        path="/"
        element={
          <Navigate
            to="/markets"
            replace
          />
        }
      />

      {/* AUTH */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* MAIN APP */}
      <Route element={<MainLayout />}>

        <Route
          path="/markets"
          element={<MarketsPage />}
        />

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        <Route
          path="/watchlist"
          element={<Watchlist />}
        />

        <Route
          path="/trading"
          element={<Trading />}
        />

        <Route
          path="/news"
          element={<News />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/markets"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;