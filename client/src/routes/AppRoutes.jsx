import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home/Home";

import Login from "../pages/Login/Login";

import Register from "../pages/Register/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import Markets from "../pages/Markets/Markets";
import Portfolio from "../pages/Portfolio/Portfolio";
import Watchlist from "../pages/Watchlist/Watchlist";
import Trading from "../pages/Trading/Trading";
import Analytics from "../pages/Analytics/Analytics";
import News from "../pages/News/News";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/markets"
        element={
          <ProtectedRoute>
            <Markets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />

      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trading"
        element={
          <ProtectedRoute>
            <Trading />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <News />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
