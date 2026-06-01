const marketSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Client Connected");

    // INDICES
    socket.emit("market-indices", [
      {
        name: "NIFTY 50",
        value: "24,850",
        change: 1.25,
      },

      {
        name: "BANK NIFTY",
        value: "52,100",
        change: -0.42,
      },

      {
        name: "SENSEX",
        value: "81,240",
        change: 0.84,
      },

      {
        name: "FIN NIFTY",
        value: "23,150",
        change: 0.35,
      },
    ]);

    // TRENDING
    socket.emit("trending-stocks", [
      {
        symbol: "RELIANCE",
        price: "2980",
      },

      {
        symbol: "TCS",
        price: "3920",
      },

      {
        symbol: "INFY",
        price: "1520",
      },

      {
        symbol: "SBIN",
        price: "967",
      },

      {
        symbol: "ICICIBANK",
        price: "1272",
      },

      {
        symbol: "HDFCBANK",
        price: "1650",
      },
    ]);

    // GAINERS
    socket.emit("top-gainers", [
      {
        symbol: "RELIANCE",
        price: "2980",
        change: "4.5",
      },

      {
        symbol: "TCS",
        price: "3920",
        change: "3.2",
      },

      {
        symbol: "INFY",
        price: "1520",
        change: "2.1",
      },
    ]);

    // LOSERS
    socket.emit("top-losers", [
      {
        symbol: "HDFCBANK",
        price: "1650",
        change: "-1.5",
      },

      {
        symbol: "AXISBANK",
        price: "1180",
        change: "-2.2",
      },

      {
        symbol: "BAJFINANCE",
        price: "7280",
        change: "-0.9",
      },
    ]);

    // MARKET TABLE
    socket.emit("market-table", [
      {
        symbol: "RELIANCE",
        company: "Reliance Industries",
        price: "2980",
        change: "4.5",
        volume: "3.2M",
      },

      {
        symbol: "TCS",
        company: "Tata Consultancy",
        price: "3920",
        change: "3.2",
        volume: "2.4M",
      },

      {
        symbol: "INFY",
        company: "Infosys",
        price: "1520",
        change: "2.1",
        volume: "1.8M",
      },
    ]);

    // SECTORS
    socket.emit("sector-performance", [
      {
        sector: "IT",
        change: "2.4",
      },

      {
        sector: "BANKING",
        change: "-1.2",
      },

      {
        sector: "AUTO",
        change: "0.8",
      },

      {
        sector: "PHARMA",
        change: "1.5",
      },

      {
        sector: "ENERGY",
        change: "-0.4",
      },
    ]);

    socket.on("disconnect", () => {
      console.log("❌ Client Disconnected");
    });
  });
};

export default marketSocket;