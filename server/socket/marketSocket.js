const {

  getLiveMarketData,

} = require("../services/upstoxMarketService");

const marketSocket = (io) => {

  io.on("connection", (socket) => {

    console.log(

      "Client Connected:",

      socket.id

    );

    // SEND MARKET DATA EVERY 3 SECONDS

    const interval = setInterval(async () => {

      const marketData =

        await getLiveMarketData();

      if (marketData) {

        socket.emit(

          "marketData",

          marketData

        );

      }

    }, 3000);

    socket.on("disconnect", () => {

      console.log(

        "Client Disconnected:",

        socket.id

      );

      clearInterval(interval);

    });

  });

};

module.exports = marketSocket;