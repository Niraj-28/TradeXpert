import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home/Home";

import Login from "../pages/Login/Login";

import Register from "../pages/Register/Register";

import Dashboard from "../pages/Dashboard/Dashboard";

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

    </Routes>

  );
};

export default AppRoutes;