import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

import MarketsPage from "../pages/Markets/MarketsPage";
import Portfolio from "../pages/Portfolio/Portfolio";
import Trading from "../pages/Trading/Trading";
import Watchlist from "../pages/Watchlist/Watchlist";
import Orders from "../pages/Orders/Orders";
import News from "../pages/News/News";
import Profile from "../pages/Profile/Profile";
import StockDetails from "../pages/StockDetails/StockDetails";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home/Home";
import TradingRules from "../pages/Resources/TradingRules";
import TechnicalGuides from "../pages/Resources/TechnicalGuides";
import PrivacyPolicy from "../pages/Resources/PrivacyPolicy";
import TermsOfUse from "../pages/Resources/TermsOfUse";

const AppRoutes = () => {
  return (
    <Routes>

      {/* HOME PAGE LANDING */}
      <Route
        path="/"
        element={<Home />}
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

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* PUBLIC APP PAGES */}
      <Route element={<MainLayout />}>
        <Route
          path="/markets"
          element={<MarketsPage />}
        />

        <Route
          path="/stocks/:symbol"
          element={<StockDetails />}
        />

        <Route
          path="/news"
          element={<News />}
        />

        <Route
          path="/resources/trading-rules"
          element={<TradingRules />}
        />

        <Route
          path="/resources/technical-guides"
          element={<TechnicalGuides />}
        />

        <Route
          path="/resources/privacy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/resources/terms"
          element={<TermsOfUse />}
        />
      </Route>

      {/* PROTECTED APP PAGES */}
      <Route 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

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
          path="/orders"
          element={<Orders />}
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