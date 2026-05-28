import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import Markets from "../pages/Markets/Markets";
import Portfolio from "../pages/Portfolio/Portfolio";
import Trading from "../pages/Trading/Trading";
import Watchlist from "../pages/Watchlist/Watchlist";
import News from "../pages/News/News";

const AppRoutes = () => {
  return (
   <Routes>

    <Route path="/" element={<Navigate to="/markets" replace />} />

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<MainLayout />}>
      <Route path="/markets" element={<Markets />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/trading" element={<Trading />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/news" element={<News />} />
    </Route>

  </Routes>
  );
};

export default AppRoutes;