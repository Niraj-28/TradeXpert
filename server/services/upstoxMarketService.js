import axios from "axios";
import WebSocket from "ws";
import protobuf from "protobufjs";
import path from "path";
import { fileURLToPath } from "url";
import { getInstrumentDetails } from "./instrumentService.mjs";

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
      const change = parseFloat(item.change ?? 0);
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

const startUpstoxMarketFeed = async (io) => {
  const token = process.env.UPSTOX_ACCESS_TOKEN;
  if (!token) {
    console.log("⚠️ UPSTOX_ACCESS_TOKEN is missing. Skipping Upstox market feed startup.");
    return;
  }

  try {
    // AUTHORIZE
    const response = await axios.get("https://api.upstox.com/v3/feed/market-data-feed/authorize", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Api-Version": "3.0",
      },
    });

    const wsUrl = response.data.data.authorized_redirect_uri;
    console.log("Upstox Feed Authorized");

    // LOAD PROTO
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const protoPath = path.resolve(__dirname, "../proto/MarketDataFeed.proto");

    const root = await protobuf.load(protoPath);
    const FeedResponse = root.lookupType("com.upstox.marketdatafeeder.rpc.proto.FeedResponse") || root.lookupType("FeedResponse");

    // CREATE WS
    const ws = new WebSocket(wsUrl);

    ws.on("open", () => {
      console.log("Upstox WebSocket Connected");

      // SUBSCRIBE
      const popularMap = getPopularInstrumentsMap();
      const keysToSubscribe = [
        ...Object.keys(indicesMap),
        ...Object.keys(popularMap),
      ];

      ws.send(
        JSON.stringify({
          guid: "tradexpert",
          method: "sub",
          data: {
            mode: "ltpc",
            instrumentKeys: keysToSubscribe,
          },
        })
      );
    });

    ws.on("message", (buffer) => {
      try {
        const decoded = FeedResponse.decode(new Uint8Array(buffer));
        const object = FeedResponse.toObject(decoded, {
          longs: String,
          enums: String,
          bytes: String,
        });

        const feeds = object.feeds || {};
        const popularMap = getPopularInstrumentsMap();
        const allStocksMap = {
          ...indicesMap,
          ...popularMap,
        };

        const marketData = Object.entries(feeds).map(([key, value]) => {
          const ltp = value.ltpc?.ltp ?? 0;
          const close = value.ltpc?.cp ?? 0;
          const change = close ? (((ltp - close) / close) * 100) : 0;

          const symbol =
            allStocksMap[key] ||
            key.split("|").pop()?.replace(/_/g, " ").trim() ||
            key;

          return {
            symbol,
            instrumentKey: key,
            price: Number(ltp),
            change: Number(change),
            ohlc: {
              open: Number(close),
              high: Number(ltp) + 10,
              low: Number(ltp) - 10,
              close: Number(close),
            },
          };
        });

        // Emit processed events
        io.emit("marketData", marketData);

        const indexSymbols = new Set([
          "NIFTY 50",
          "BANK NIFTY",
          "BANKNIFTY",
          "SENSEX",
          "FIN NIFTY",
          "FINNIFTY",
        ]);

        const indicesData = marketData
          .filter((item) => indexSymbols.has(item.symbol))
          .map((item) => ({
            name: item.symbol,
            value: Number(item.price),
            change: Number(item.change),
          }));

        const stockData = marketData.filter((item) => !indexSymbols.has(item.symbol));

        const trendingData = stockData.slice(0, 6).map((item) => ({
          symbol: item.symbol,
          price: item.price,
          change: Number(item.change),
        }));

        const gainersData = [...stockData]
          .sort((a, b) => parseFloat(b.change) - parseFloat(a.change))
          .slice(0, 3)
          .map((item) => ({
            symbol: item.symbol,
            price: item.price,
            change: Number(item.change),
          }));

        const losersData = [...stockData]
          .sort((a, b) => parseFloat(a.change) - parseFloat(b.change))
          .slice(0, 3)
          .map((item) => ({
            symbol: item.symbol,
            price: item.price,
            change: Number(item.change),
          }));

        const marketTableData = stockData.map((item) => {
          const details = getInstrumentDetails(item.symbol);
          return {
            symbol: item.symbol,
            company: details?.name || item.symbol,
            price: item.price,
            change: Number(item.change),
            volume: "—",
          };
        });

        const dynamicSectors = calculateSectorPerformance(stockData);

        io.emit("market-indices", indicesData);
        io.emit("trending-stocks", trendingData);
        io.emit("market-table", marketTableData);
        io.emit("top-gainers", gainersData);
        io.emit("top-losers", losersData);
        io.emit("sector-performance", dynamicSectors);

        // Check pending limit orders
        try {
          const { checkPendingLimitOrders } = require("../services/orderExecutionService.cjs");
          for (const item of marketData) {
            if (!indexSymbols.has(item.symbol)) {
              checkPendingLimitOrders(item.symbol, Number(item.price), io).catch(err => {
                console.error("Error checking limits in Upstox WS:", err.message);
              });
            }
          }
        } catch (err) {
          console.error("Failed limit checking on Upstox WS message:", err.message);
        }

      } catch (error) {
        console.log("Decode Error:", error.message);
      }
    });

    ws.on("close", () => {
      console.log("Upstox Socket Closed");
    });

  } catch (error) {
    console.log("UPSTOX ERROR:", error.response?.data || error.message);
  }
};

export default startUpstoxMarketFeed;
