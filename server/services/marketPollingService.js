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

const POPULAR_SYMBOLS = [
  "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "BHARTIARTL", 
  "ITC", "LT", "TATASTEEL", "TATAMOTORS", "WIPRO", "AXISBANK", "KOTAKBANK", 
  "HINDUNILVR", "ADANIENT", "BAJFINANCE", "MARUTI", "SUNPHARMA", "M&M", 
  "ONGC", "POWERGRID", "NTPC", "COALINDIA", "ADANIPORTS", "ULTRACEMCO", 
  "GRASIM", "JSWSTEEL", "LTIM", "HINDALCO"
];

const indicesMap = {
  "NSE_INDEX|Nifty 50": "NIFTY 50",
  "NSE_INDEX|Nifty Bank": "BANK NIFTY",
  "BSE_INDEX|SENSEX": "SENSEX",
  "NSE_INDEX|Nifty Fin Service": "FIN NIFTY",
};

let popularInstrumentsMap = null;

const getPopularInstrumentsMap = () => {
  if (popularInstrumentsMap) return popularInstrumentsMap;
  
  const mapping = {};
  for (const sym of POPULAR_SYMBOLS) {
    const details = getInstrumentDetails(sym);
    if (details && details.instrument_key) {
      mapping[details.instrument_key] = sym;
    } else {
      mapping[`NSE_EQ|${sym}`] = sym;
    }
  }
  popularInstrumentsMap = mapping;
  return popularInstrumentsMap;
};

// Persistent simulated prices store for fallback
let simulatedPricesStore = {};

const coreBasePrices = {
  "NIFTY 50": 22500.0,
  "BANK NIFTY": 48200.0,
  "SENSEX": 74000.0,
  "FIN NIFTY": 21500.0,
};

const getOrInitializeSimulatedPrice = (symbol, instrumentKey) => {
  const sym = symbol.toUpperCase();
  if (simulatedPricesStore[sym]) {
    return simulatedPricesStore[sym];
  }

  let basePrice = coreBasePrices[sym];
  let changePercent = 0.0;
  let open = 0.0;

  let hash = 0;
  for (let i = 0; i < sym.length; i++) {
    hash = sym.charCodeAt(i) + ((hash << 5) - hash);
  }
  const baseVolume = Math.abs(hash % 5000000) + 100000;

  if (basePrice === undefined) {
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
    volume: baseVolume,
  };

  simulatedPricesStore[sym] = data;
  return data;
}

const stockSectors = {
  TCS: "IT", INFY: "IT", WIPRO: "IT", LTIM: "IT",
  HDFCBANK: "BANKING", ICICIBANK: "BANKING", SBIN: "BANKING", AXISBANK: "BANKING", KOTAKBANK: "BANKING",
  TATAMOTORS: "AUTO", MARUTI: "AUTO", "M&M": "AUTO",
  SUNPHARMA: "PHARMA",
  RELIANCE: "ENERGY", ONGC: "ENERGY", NTPC: "ENERGY", POWERGRID: "ENERGY", COALINDIA: "ENERGY",
  TATASTEEL: "METAL", JSWSTEEL: "METAL", HINDALCO: "METAL",
  LT: "INFRASTRUCTURE", ULTRACEMCO: "INFRASTRUCTURE", GRASIM: "INFRASTRUCTURE",
  ITC: "CONSUMER GOODS", HINDUNILVR: "CONSUMER GOODS", LICI: "INSURANCE",
  ADANIENT: "CONGLOMERATES", ADANIPORTS: "INFRASTRUCTURE", JIOFIN: "FINANCIAL SERVICES"
};

const calculateSectorPerformance = (stockData) => {
  const sectorChanges = {};
  const sectorCounts = {};

  stockData.forEach((item) => {
    const sector = stockSectors[item.symbol?.toUpperCase()];
    if (sector) {
      const change = parseFloat(item.percent ?? item.change ?? 0);
      if (!isNaN(change)) {
        sectorChanges[sector] = (sectorChanges[sector] || 0) + change;
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      }
    }
  });

  const sectorsList = Object.keys(sectorChanges).map((sec) => ({
    sector: sec,
    change: Number((sectorChanges[sec] / sectorCounts[sec]).toFixed(2)),
  }));

  return sectorsList.sort((a, b) => b.change - a.change);
};

function emitMarketData(formattedData) {
  const indexSymbols = new Set([
    "NIFTY 50",
    "BANK NIFTY",
    "SENSEX",
    "FIN NIFTY",
  ]);

  const indicesData = formattedData
    .filter((item) => indexSymbols.has(item.symbol))
    .map((item) => ({
      name: item.symbol,
      value: `₹${item.price}`,
      change: Number(item.percent),
    }));

  const stockData = formattedData.filter(
    (item) => !indexSymbols.has(item.symbol)
  );

  const formatVolumeValue = (val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return "—";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const trendingData = [...stockData]
    .sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      const volA = Number(a.volume) || 0;
      const volB = Number(b.volume) || 0;
      
      const percentA = Number(a.percent) || 0;
      const percentB = Number(b.percent) || 0;

      const valueA = volA * priceA;
      const valueB = volB * priceB;

      // Positive change stocks (buying pressure) first
      const isPosA = percentA > 0 ? 1 : 0;
      const isPosB = percentB > 0 ? 1 : 0;

      if (isPosA !== isPosB) {
        return isPosB - isPosA;
      }

      // If both are positive, sort by traded value/turnover descending
      if (isPosA === 1) {
        return valueB - valueA;
      }

      // If both are non-positive, sort by percentage change descending (closer to positive first)
      if (percentA !== percentB) {
        return percentB - percentA;
      }

      // Fallback to traded value descending
      return valueB - valueA;
    })
    .slice(0, 6)
    .map((item) => {
      const details = getInstrumentDetails(item.symbol);
      return {
        symbol: item.symbol,
        company: details?.name || item.symbol,
        price: item.price,
        change: item.percent,
      };
    });

  const marketTableData = stockData.map((item) => {
    const details = getInstrumentDetails(item.symbol);
    return {
      symbol: item.symbol,
      company: details?.name || item.symbol,
      price: item.price,
      change: item.percent,
      volume: formatVolumeValue(item.volume),
    };
  });

  const gainersData = [...stockData]
    .sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent))
    .slice(0, 5)
    .map((item) => ({
      symbol: item.symbol,
      price: item.price,
      change: item.percent,
    }));

  const losersData = [...stockData]
    .sort((a, b) => parseFloat(a.percent) - parseFloat(b.percent))
    .slice(0, 5)
    .map((item) => ({
      symbol: item.symbol,
      price: item.price,
      change: item.percent,
    }));

  const dynamicSectors = calculateSectorPerformance(stockData);

  ioInstance.emit("market-indices", indicesData);
  ioInstance.emit("trending-stocks", trendingData);
  ioInstance.emit("market-table", marketTableData);
  ioInstance.emit("top-gainers", gainersData);
  ioInstance.emit("top-losers", losersData);
  ioInstance.emit("sector-performance", dynamicSectors);
  ioInstance.emit("marketData", formattedData);

  // Check and trigger pending limit orders
  try {
    const { checkPendingLimitOrders } = require("./orderExecutionService.cjs");
    for (const item of formattedData) {
      if (!indexSymbols.has(item.symbol)) {
        checkPendingLimitOrders(item.symbol, parseFloat(item.price), ioInstance).catch(err => {
          console.error("Error checking limits in background:", err.message);
        });
      }
    }
  } catch (e) {
    console.error("Failed to load limit order execution service in background:", e.message);
  }
}

function simulateAndEmitPrices(activeSymbolsMap) {
  const allSymbols = {};
  
  const popularMap = getPopularInstrumentsMap();
  // Populate from indicesMap
  for (const [key, val] of Object.entries(indicesMap)) {
    allSymbols[key] = val;
  }
  // Populate from popularMap
  for (const [key, val] of Object.entries(popularMap)) {
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

    // Simulate volume increment (always positive during a session)
    const volIncrement = Math.floor(Math.random() * 15000) + 1000;
    data.volume = (Number(data.volume) || 100000) + volIncrement;

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
      volume: data.volume,
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

  const popularMap = getPopularInstrumentsMap();
  const instrumentsToPoll = [
    ...Object.keys(indicesMap),
    ...Object.keys(popularMap),
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
        indicesMap[normalizedKey] ||
        indicesMap[key] ||
        popularMap[normalizedKey] ||
        popularMap[key] ||
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

      const priceValue = Number(item.last_price ?? item.close ?? item.ltp ?? 0);
      const changeValue = Number(item.net_change ?? item.change ?? 0);
      const prevClose = priceValue - changeValue;
      const percentValue = prevClose !== 0 ? (changeValue / prevClose) * 100 : 0;

      return {
        symbol: baseSymbol || String(key),
        instrument: key,
        price: priceValue.toFixed(2),
        change: changeValue.toFixed(2),
        percent: percentValue.toFixed(2),
        high: item.ohlc?.high || priceValue * 1.01,
        low: item.ohlc?.low || priceValue * 0.99,
        open: item.ohlc?.open || priceValue,
        close: item.ohlc?.close || priceValue,
        volume: Number(item.volume) || 0,
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