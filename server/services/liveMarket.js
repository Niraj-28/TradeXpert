const {

  getLiveMarketData,

} = require("./upstoxMarketService");

const startLiveMarket = (io) => {

  setInterval(async () => {

    const marketData =

      await getLiveMarketData();

    if (!marketData) return;

    const formattedData =

      Object.values(marketData).map((stock) => ({

        symbol:

          stock.instrument_token ||

          "N/A",

        name:

          stock.trading_symbol ||

          "STOCK",

        price:

          stock.last_price ||

          0,

        open:

          stock.ohlc?.open ||

          0,

        high:

          stock.ohlc?.high ||

          0,

        low:

          stock.ohlc?.low ||

          0,

        close:

          stock.ohlc?.close ||

          0,

        change:

          stock.net_change ||

          0,

      }));

    io.emit(

      "market-update",

      formattedData

    );

  }, 3000);

};

module.exports = {
  startLiveMarket,
};