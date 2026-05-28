import express from "express";

import http from "http";

import cors from "cors";

import dotenv from "dotenv";

import { Server } from "socket.io";

import connectDB from "./config/db.js";

import {
  initializeMarketPolling,
} from "./services/marketPollingService.js";

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

initializeMarketPolling(io);

// ROUTES
// Auth (register/login)
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});
