import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const connectDB = require("./config/db.cjs");

import {
  initializeMarketPolling,
} from "./services/marketPollingService.js";

import startUpstoxMarketFeed from "./services/upstoxMarketService.js";

import { fetchAllInstruments } from "./services/instrumentService.mjs";

const app = express();

const server =
  http.createServer(app);

const io = new Server(server, {

  cors: {

    origin: [
      "http://localhost:5173",
      "https://tradexpert.vercel.app"
    ],

    methods: [
      "GET",
      "POST",
    ],

  },

});

app.set("io", io);

app.use(cors());

app.use(express.json());

connectDB();

// Fetch and cache NSE & BSE equity instruments on boot in the background
fetchAllInstruments().catch((err) => {
  console.error("❌ [INSTRUMENTS ERROR] Error loading instruments on boot:", err.message);
});

// Initialize real-time market feed via WebSocket
startUpstoxMarketFeed(io);

// Start the polling fallback for Upstox quote updates
initializeMarketPolling(io);

io.on("connection", (socket) => {
  console.log("✅ Client Connected:", socket.id);

  socket.on("join-user-room", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`👤 Socket ${socket.id} joined user room: ${userId}`);
    }
  });

  socket.on("view-stock", (symbol) => {
    if (symbol) {
      socket.currentViewedStock = symbol.toUpperCase();
      console.log(`👁️ Client ${socket.id} started viewing: ${socket.currentViewedStock}`);
    }
  });

  socket.on("unview-stock", () => {
    if (socket.currentViewedStock) {
      console.log(`👁️ Client ${socket.id} stopped viewing: ${socket.currentViewedStock}`);
      socket.currentViewedStock = null;
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected:", socket.id);
  });
});

// ROUTES
// Auth (register/login)
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

// Market routes (search)
import marketRoutes from "./routes/marketRoutes.js";
app.use("/api/market", marketRoutes);

// Upstox OAuth routes
import upstoxRoutes from "./routes/upstoxRoutes.js";
app.use("/api/upstox", upstoxRoutes);

// Watchlist routes
import watchlistRoutes from "./routes/watchlistRoutes.js";
app.use("/api/watchlist", watchlistRoutes);

// Holdings routes
import holdingRoutes from "./routes/holdingRoutes.js";
app.use("/api/holdings", holdingRoutes);

// Orders routes
import orderRoutes from "./routes/orderRoutes.js";
app.use("/api/orders", orderRoutes);

// Trade routes
import tradeRoutes from "./routes/tradeRoutes.js";
app.use("/api/trade", tradeRoutes);

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});
