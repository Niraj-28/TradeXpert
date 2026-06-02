import express from "express";
import http from "http";
import cors from "cors";

import { Server } from "socket.io";

import marketSocket from "./socket/marketSocket.js";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

/*
|--------------------------------------------------------------------------
| MOCK MARKET DATA
|--------------------------------------------------------------------------
*/

const marketData = [
  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    price: "2980.50",
    change: "4.50",
    volume: "3.2M",
  },

  {
    symbol: "TCS",
    company: "Tata Consultancy",
    price: "3920.20",
    change: "2.10",
    volume: "2.4M",
  },

  {
    symbol: "INFY",
    company: "Infosys",
    price: "1520.80",
    change: "1.20",
    volume: "1.8M",
  },

  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    price: "1650.10",
    change: "-1.40",
    volume: "2.1M",
  },

  {
    symbol: "ICICIBANK",
    company: "ICICI Bank",
    price: "1272.70",
    change: "-0.80",
    volume: "2.7M",
  },

  {
    symbol: "SBIN",
    company: "State Bank of India",
    price: "967.80",
    change: "0.90",
    volume: "4.3M",
  },
];

/*
|--------------------------------------------------------------------------
| SOCKET
|--------------------------------------------------------------------------
*/

marketSocket(io);

app.get("/", (req, res) => {
  res.send("TradeXpert Server Running");
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});