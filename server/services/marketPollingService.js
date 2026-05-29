import axios from "axios";

let ioInstance = null;

export const initializeMarketPolling = (
  io
) => {

  ioInstance = io;

  startPolling();

};

// Chunking helper
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

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

    if (!process.env.UPSTOX_ACCESS_TOKEN) {
      console.log("⚠️ UPSTOX_ACCESS_TOKEN missing — skipping market polling.");
      return;
    }

    const instrumentsToPoll = Object.keys(symbolMap);

    // Poll in batches to avoid overlong query strings
    const batches = chunkArray(instrumentsToPoll, 200);

    let aggregatedRaw = {};

    for (const batch of batches) {
      const response = await axios.get("https://api.upstox.com/v2/market-quote/quotes", {
        headers: {
          Authorization: `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
        params: {
          instrument_key: batch.join(","),
        },
      });

      const rawDataPart = response.data.data || {};

      aggregatedRaw = { ...aggregatedRaw, ...rawDataPart };
    }

    const rawData = aggregatedRaw;

    console.log("RAW API: keys:", Object.keys(rawData).length);

      // If no raw data was returned (likely missing token or no instruments), emit a small mock set
      if (!Object.keys(rawData).length) {
        console.log("No market quotes returned — emitting fallback mock data");

        const mockFormatted = Object.entries(symbolMap).map(([k, v], i) => ({
          symbol: v,
          instrument: k,
          price: (100 + i).toFixed(2),
          change: (Math.random() * 2 - 1).toFixed(2),
          percent: (Math.random() * 2 - 1).toFixed(2),
        }));

        const indicesData = mockFormatted.slice(0, 4).map((item) => ({
          name: item.symbol,
          value: `₹${item.price}`,
          change: Number(item.change),
        }));

        const trendingData = mockFormatted.slice(0, 6).map((item) => ({
          symbol: item.symbol,
          price: item.price,
          change: item.change,
        }));

        const marketTableData = mockFormatted.map((item) => ({
          symbol: item.symbol,
          company: item.symbol,
          price: item.price,
          change: item.change,
          volume: "—",
        }));

        const gainersData = mockFormatted.slice(0, 3);
        const losersData = mockFormatted.slice(3, 6);

        ioInstance.emit("market-indices", indicesData);
        ioInstance.emit("trending-stocks", trendingData);
        ioInstance.emit("market-table", marketTableData);
        ioInstance.emit("top-gainers", gainersData);
        ioInstance.emit("top-losers", losersData);
        ioInstance.emit("sector-performance", [
          { sector: "IT", change: 1.2 },
          { sector: "BANKING", change: -0.4 },
        ]);
        ioInstance.emit("marketData", mockFormatted);

        return;
      }
    const formattedData =
      Object.keys(rawData).map((key) => {
        const item = rawData[key] || {};
        const normalizedKey = key.replace(":", "|");

        // Try a sequence of lookups to derive a readable symbol/trading code.
        const tryValues = [
          item.symbol,
          item.tradingsymbol,
          item.trading_symbol,
          item.instrument,
        ];

        // Lookup in symbolMap using exact or lowercase-normalized keys
        const symbolLookup =
          symbolMap[normalizedKey] ||
          symbolMap[key] ||
          symbolMap[normalizedKey.toLowerCase()] ||
          symbolMap[key.toLowerCase()];

        // Fallback to extracting the last segment after '|' or ':' and cleaning it
        const fallbackFromKey = (() => {
          try {
            const seg = normalizedKey.split("|").pop();
            return seg ? String(seg).replace(/_/g, " ").trim() : null;
          } catch (e) {
            return null;
          }
        })();

        const isValidSymbol = (v) => {
          if (!v) return false;
          const s = String(v).trim().toLowerCase();
          return s && s !== "na" && s !== "n/a" && s !== "null" && s !== "undefined";
        };

        let baseSymbol = tryValues.find(isValidSymbol) || symbolLookup || fallbackFromKey || key;
        baseSymbol = String(baseSymbol).trim();

        const priceValue =
          item.last_price ?? item.close ?? item.ltp ?? 0;
        const changeValue =
          item.net_change ?? item.change ?? 0;
        const percentValue =
          item.percent_change ?? item.change_percentage ?? 0;

        return {
          symbol: baseSymbol || String(key),
          instrument: key,
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

    const indexSymbols = new Set([
      "NIFTY 50",
      "BANK NIFTY",
      "SENSEX",
      "FIN NIFTY",
    ]);

    const companyMap = {
      RELIANCE: "Reliance Industries",
      TCS: "Tata Consultancy Services",
      INFY: "Infosys",
      HDFCBANK: "HDFC Bank",
      ICICIBANK: "ICICI Bank",
      SBIN: "State Bank of India",
    };

    const sectorFallback = [
      { sector: "IT", change: 1.2 },
      { sector: "BANKING", change: -0.4 },
      { sector: "AUTO", change: 0.8 },
      { sector: "PHARMA", change: 1.5 },
      { sector: "ENERGY", change: -0.2 },
    ];

    const indicesData = formattedData
      .filter((item) => indexSymbols.has(item.symbol))
      .map((item) => ({
        name: item.symbol,
        value: `₹${item.price}`,
        change: Number(item.change),
      }));

    const stockData = formattedData.filter(
      (item) => !indexSymbols.has(item.symbol)
    );

    const trendingData = stockData.slice(0, 6).map((item) => ({
      symbol: item.symbol,
      price: item.price,
      change: item.change,
    }));

    const marketTableData = stockData.map((item) => ({
      symbol: item.symbol,
      company: companyMap[item.symbol] || item.symbol,
      price: item.price,
      change: item.change,
      volume: item.volume || "—",
    }));

    const gainersData = [...stockData]
      .sort((a, b) => parseFloat(b.change) - parseFloat(a.change))
      .slice(0, 3)
      .map((item) => ({
        symbol: item.symbol,
        price: item.price,
        change: item.change,
      }));

    const losersData = [...stockData]
      .sort((a, b) => parseFloat(a.change) - parseFloat(b.change))
      .slice(0, 3)
      .map((item) => ({
        symbol: item.symbol,
        price: item.price,
        change: item.change,
      }));

    ioInstance.emit("market-indices", indicesData);
    ioInstance.emit("trending-stocks", trendingData);
    ioInstance.emit("market-table", marketTableData);
    ioInstance.emit("top-gainers", gainersData);
    ioInstance.emit("top-losers", losersData);
    ioInstance.emit("sector-performance", sectorFallback);
    ioInstance.emit("marketData", formattedData);

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