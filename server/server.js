const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const marketSocket = require(

  "./socket/marketSocket"

);

// CONFIG

dotenv.config();

// DATABASE

connectDB();

// EXPRESS APP

const app = express();

// HTTP SERVER

const server = http.createServer(app);

// SOCKET.IO

const io = new Server(server, {

  cors: {

    origin: "http://localhost:5173",

    methods: ["GET", "POST"],

  },

});

// MARKET SOCKET

marketSocket(io);

// MIDDLEWARE

app.use(cors());

app.use(express.json());

// ROUTES

app.use(

  "/api/auth",

  require("./routes/authRoutes")

);

app.use(

  "/api/upstox",

  require("./routes/upstoxRoutes")

);

app.use(

  "/api/trade",

  require("./routes/tradeRoutes")

);

// TEST ROUTE

app.get("/", (req, res) => {

  res.send(

    "TradeXpert API Running"

  );

});

// TEST UPSTOX ROUTE

const {

  getLiveMarketData,

} = require(

  "./services/upstoxMarketService"

);

app.get(

  "/test-upstox",

  async (req, res) => {

    const data =

      await getLiveMarketData();

    res.json(data);

  }

);

// START SERVER

const PORT =

  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`

  );

});