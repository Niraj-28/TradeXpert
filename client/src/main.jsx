import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";

import {
  MarketProvider,
} from "./context/MarketContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      <MarketProvider>
        <App />
      </MarketProvider>

    </BrowserRouter>

  </React.StrictMode>
);