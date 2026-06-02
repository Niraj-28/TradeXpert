import axios from "axios";

let marketData = {};

let subscribedStocks = [];

/* =========================================
   LOAD NSE/BSE INSTRUMENTS
========================================= */

export const loadInstruments =
  async () => {

    try {

      console.log(
        "📦 Loading Instruments..."
      );

      const response =
        await axios.get(
          "https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz",
          {
            responseType: "arraybuffer",
          }
        );

      console.log(
        "✅ Instrument file loaded"
      );

    } catch (error) {

      console.log(
        "Instrument Load Error:",
        error.message
      );

    }

  };

/* =========================================
   MARKET CACHE
========================================= */

export const updateMarketData =
  (symbol, data) => {

    marketData[symbol] = {
      ...marketData[symbol],
      ...data,
      updatedAt: Date.now(),
    };

  };

export const getMarketData =
  () => marketData;

/* =========================================
   SUBSCRIPTIONS
========================================= */

export const addSubscription =
  (instrumentKey) => {

    if (
      !subscribedStocks.includes(
        instrumentKey
      )
    ) {

      subscribedStocks.push(
        instrumentKey
      );

    }

  };

export const getSubscriptions =
  () => subscribedStocks;