import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  MarketProvider,
} from "./context/MarketContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <MarketProvider>

          <App />

        </MarketProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
);