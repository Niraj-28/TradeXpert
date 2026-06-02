import axios from "axios";
import { createRequire } from "module";
import { getInstrumentDetails } from "./instrumentService.mjs";

const require = createRequire(import.meta.url);
const Holding = require("../models/holdingModel.cjs");
const Watchlist = require("../models/watchlistModel.cjs");

let ioInstance = null;

export const initializeMarketPolling = (io) => {
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
  "NSE_INDEX|Nifty 50": "NIFTY 50",
  "NSE_INDEX|Nifty Bank": "BANK NIFTY",
  "BSE_INDEX|SENSEX": "SENSEX",
  "NSE_INDEX|Nifty Fin Service": "FIN NIFTY",

  // STOCKS
  "NSE_EQ|INE002A01018": "RELIANCE",
  "NSE_EQ|INE467B01029": "TCS",
  "NSE_EQ|INE009A01021": "INFY",
  "NSE_EQ|INE040A01034": "HDFCBANK",
  "NSE_EQ|INE090A01021": "ICICIBANK",
  "NSE_EQ|INE062A01020": "SBIN",
};

// Persistent simulated prices store for fallback
let simulatedPricesStore = {};

const coreBasePrices = {
  "NIFTY 50": 22500.0,
  "BANK NIFTY": 48200.0,
  "SENSEX": 74000.0,
  "FIN NIFTY": 21500.0,
  "RELIANCE": 2450.0,
  "TCS": 3850.0,
  "INFY": 1420.0,
  "HDFCBANK": 1520.0,
  "ICICIBANK": 1120.0,
  "SBIN": 780.0,
};

const getOrInitializeSimulatedPrice = (symbol, instrumentKey) => {
  const sym = symbol.toUpperCase();
  if (simulatedPricesStore[sym]) {
    return simulatedPricesStore[sym];
  }

  let basePrice = coreBasePrices[sym];
  let changePercent = 0.0;
  let open = 0.0;

  if (basePrice === undefined) {
    let hash = 0;
    for (let i = 0; i < sym.length; i++) {
      hash = sym.charCodeAt(i) + ((hash << 5) - hash);
    }
    basePrice = Math.abs(hash % 2900) + 100; // Rs 100 - 3000
    changePercent = ((hash % 100) / 25) - 2; // -2% to +2%
    open = basePrice * (1 - changePercent / 100);
  } else {
    changePercent = (Math.random() * 4 - 2); // -2% to +2%
    open = basePrice * (1 - changePercent / 100);
  }

  const data = {
    symbol: sym,
    instrument: instrumentKey || `NSE_EQ|${sym}`,
    price: Number(basePrice.toFixed(2)),
    change: Number(changePercent.toFixed(2)),
    percent: Number(changePercent.toFixed(2)),
    open: Number(open.toFixed(2)),
    close: Number(open.toFixed(2)),
    prevClose: Number(open.toFixed(2)),
    high: Number((basePrice * 1.012).toFixed(2)),
    low: Number((basePrice * 0.988).toFixed(2)),
    volume: "1.2M",
  };

  simulatedPricesStore[sym] = data;
  return data;
};

function emitMarketData(formattedData) {
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
}

function simulateAndEmitPrices(activeSymbolsMap) {
  const allSymbols = {};
  
  // Populate from symbolMap
  for (const [key, val] of Object.entries(symbolMap)) {
    allSymbols[key] = val;
  }
  // Populate from activeSymbolsMap (user custom stocks)
  for (const [key, val] of Object.entries(activeSymbolsMap)) {
    allSymbols[key] = val;
  }

  const formattedData = Object.entries(allSymbols).map(([k, v]) => {
    const data = getOrInitializeSimulatedPrice(v, k);

    // Apply fluctuation
    const fluctuation = (Math.random() * 0.3 - 0.15) / 100; // ±0.15%
    const newPrice = Number((data.price * (1 + fluctuation)).toFixed(2));
    const newChange = Number((newPrice - data.prevClose).toFixed(2));
    const newPercent = Number((((newPrice - data.prevClose) / data.prevClose) * 100).toFixed(2));

    data.price = newPrice;
    data.change = newChange;
    data.percent = newPercent;
    data.high = Number(Math.max(data.high, newPrice).toFixed(2));
    data.low = Number(Math.min(data.low, newPrice).toFixed(2));

    return {
      symbol: data.symbol,
      instrument: data.instrument,
      price: data.price.toFixed(2),
      change: data.change.toFixed(2),
      percent: data.percent.toFixed(2),
      high: data.high,
      low: data.low,
      open: data.open,
      close: data.close,
    };
  });

  emitMarketData(formattedData);
}

async function fetchMarketData() {
  const dynamicSymbolMap = {};
  try {
    const [holdings, watchlists] = await Promise.all([
      Holding.find({}, "symbol").lean(),
      Watchlist.find({}, "symbol").lean(),
    ]);

    const dbSymbols = new Set();
    if (holdings) holdings.forEach((h) => h.symbol && dbSymbols.add(h.symbol.trim().toUpperCase()));
    if (watchlists) watchlists.forEach((w) => w.symbol && dbSymbols.add(w.symbol.trim().toUpperCase()));
    
    // Add currently viewed symbols from all connected sockets
    if (ioInstance && ioInstance.sockets && ioInstance.sockets.sockets) {
      for (const [id, socket] of ioInstance.sockets.sockets.entries()) {
        if (socket.currentViewedStock) {
          dbSymbols.add(socket.currentViewedStock.trim().toUpperCase());
        }
      }
    }

    for (const sym of dbSymbols) {
      const details = getInstrumentDetails(sym);
      if (details && details.instrument_key) {
        dynamicSymbolMap[details.instrument_key] = sym;
      }
    }
  } catch (err) {
    console.error("Error querying db symbols:", err.message);
  }

  if (!process.env.UPSTOX_ACCESS_TOKEN) {
    simulateAndEmitPrices(dynamicSymbolMap);
    return;
  }

  const instrumentsToPoll = [
    ...Object.keys(symbolMap),
    ...Object.keys(dynamicSymbolMap),
  ];
  const uniqueInstruments = [...new Set(instrumentsToPoll)];

  try {
    const batches = chunkArray(uniqueInstruments, 200);
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

    if (!Object.keys(rawData).length) {
      console.log("No market quotes returned — running fallback simulation");
      simulateAndEmitPrices(dynamicSymbolMap);
      return;
    }

    const formattedData = Object.keys(rawData).map((key) => {
      const item = rawData[key] || {};
      const normalizedKey = key.replace(":", "|");

      const tryValues = [
        item.symbol,
        item.tradingsymbol,
        item.trading_symbol,
        item.instrument,
      ];

      const symbolLookup =
        symbolMap[normalizedKey] ||
        symbolMap[key] ||
        symbolMap[normalizedKey.toLowerCase()] ||
        symbolMap[key.toLowerCase()] ||
        dynamicSymbolMap[key] ||
        dynamicSymbolMap[normalizedKey];

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

      const priceValue = item.last_price ?? item.close ?? item.ltp ?? 0;
      const changeValue = item.net_change ?? item.change ?? 0;
      const percentValue = item.percent_change ?? item.change_percentage ?? 0;

      return {
        symbol: baseSymbol || String(key),
        instrument: key,
        price: Number(priceValue).toFixed(2),
        change: Number(changeValue).toFixed(2),
        percent: Number(percentValue).toFixed(2),
        high: item.ohlc?.high || Number(priceValue) * 1.01,
        low: item.ohlc?.low || Number(priceValue) * 0.99,
        open: item.ohlc?.open || priceValue,
        close: item.ohlc?.close || priceValue,
      };
    });

    emitMarketData(formattedData);
  } catch (error) {
    console.log(
      "MARKET ERROR, falling back to simulated updates:",
      error.response?.data || error.message
    );
    simulateAndEmitPrices(dynamicSymbolMap);
  }
}

function startPolling() {
  fetchMarketData();
  setInterval(() => {
    fetchMarketData();
  }, 3000);
}