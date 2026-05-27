const startUpstoxMarketFeed = require(
  "../services/upstoxMarketService"
);

const initializeMarketSocket = (io) => {

  io.on("connection", (socket) => {

    console.log(
      "Client Connected:",
      socket.id
    );

  });

  // START REALTIME FEED

  startUpstoxMarketFeed(io);

};

module.exports = initializeMarketSocket;