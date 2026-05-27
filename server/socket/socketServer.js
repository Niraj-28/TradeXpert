const {

  Server,

} = require("socket.io");

const startUpstoxMarketFeed =
  require(

    "../services/upstoxMarketService"

  );

const initializeSocket = (

  server

) => {

  const io = new Server(server, {

    cors: {

      origin: "*",

    },

  });

  io.on(

    "connection",

    (socket) => {

      console.log(

        "Frontend Connected:",

        socket.id

      );

    }

  );

  // START REAL MARKET FEED

  startUpstoxMarketFeed(io);

};

module.exports =
  initializeSocket;