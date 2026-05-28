import axios from "axios";

let ioInstance = null;

export const initializeMarketPolling = (
  io
) => {

  ioInstance = io;

  startPolling();

};

const instruments = [

  // INDICES

  "NSE_INDEX|Nifty 50",
  "NSE_INDEX|Nifty Bank",
  "BSE_INDEX|SENSEX",
  "NSE_INDEX|Nifty Fin Service",

  // STOCKS

  "NSE_EQ|INE002A01018", // RELIANCE
  "NSE_EQ|INE467B01029", // TCS
  "NSE_EQ|INE009A01021", // INFY
  "NSE_EQ|INE040A01034", // HDFCBANK
  "NSE_EQ|INE090A01021", // ICICIBANK
  "NSE_EQ|INE062A01020", // SBIN

];

const symbolMap = {

  // INDICES

  "NSE_INDEX|Nifty 50":
    "NIFTY 50",

  "NSE_INDEX|Nifty Bank":
    "BANK NIFTY",

  "BSE_INDEX|SENSEX":
    "SENSEX",

  "NSE_INDEX|Nifty Fin Service":
    "FIN NIFTY",

  // STOCKS

  "NSE_EQ|INE002A01018":
    "RELIANCE",

  "NSE_EQ|INE467B01029":
    "TCS",

  "NSE_EQ|INE009A01021":
    "INFY",

  "NSE_EQ|INE040A01034":
    "HDFCBANK",

  "NSE_EQ|INE090A01021":
    "ICICIBANK",

  "NSE_EQ|INE062A01020":
    "SBIN",

};

async function fetchMarketData() {

  try {

    const response =
      await axios.get(

        "https://api.upstox.com/v2/market-quote/quotes",

        {

          headers: {

            Authorization:
              `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`,

            Accept:
              "application/json",

          },

          params: {

            instrument_key:
              instruments.join(","),

          },

        }
      );

    const rawData =
      response.data.data || {};

    console.log(
      "RAW API:",
      rawData
    );

    const formattedData =
      Object.keys(rawData).map((key) => {
        const item = rawData[key] || {};
        const normalizedKey = key.replace(":", "|");
        const baseSymbol =
          item.symbol ||
          item.tradingsymbol ||
          symbolMap[key] ||
          symbolMap[normalizedKey] ||
          key;

        const priceValue =
          item.last_price ?? item.close ?? item.ltp ?? 0;
        const changeValue =
          item.net_change ?? item.change ?? 0;
        const percentValue =
          item.percent_change ?? item.change_percentage ?? 0;

        return {
          symbol: String(baseSymbol),
          price: Number(priceValue).toFixed(2),
          change: Number(changeValue).toFixed(2),
          percent: Number(percentValue).toFixed(2),
          high: item.ohlc?.high || 0,
          low: item.ohlc?.low || 0,
          open: item.ohlc?.open || 0,
          close: item.ohlc?.close || 0,
        };
      });

    console.log(
      "FORMATTED:",
      formattedData
    );

    ioInstance.emit(
      "marketData",
      formattedData
    );

  } catch (error) {

    console.log(
      "MARKET ERROR:",
      error.response?.data ||
      error.message
    );

  }

}

function startPolling() {

  fetchMarketData();

  setInterval(() => {

    fetchMarketData();

  }, 3000);

}