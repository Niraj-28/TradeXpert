import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const connectDB = require("./config/db.cjs");

import {
  initializeMarketPolling,
} from "./services/marketPollingService.js";

import startUpstoxMarketFeed from "./services/upstoxMarketService.js";

dotenv.config();

const app = express();

const server =
  http.createServer(app);

const io = new Server(server, {

  cors: {

    origin:
      "http://localhost:5173",

    methods: [
      "GET",
      "POST",
    ],

  },

});

app.use(cors());

app.use(express.json());

connectDB();

// Initialize real-time market feed via WebSocket
startUpstoxMarketFeed(io);

// Start the polling fallback for Upstox quote updates
initializeMarketPolling(io);

io.on(
  "connection",
  (socket) => {

    console.log(
      "✅ Client Connected:",
      socket.id
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          "❌ Client Disconnected:",
          socket.id
        );

      }
    );

  }
);

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

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});
