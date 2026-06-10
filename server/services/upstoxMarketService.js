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

    const wsUrl =
      response.data.data.authorized_redirect_uri;

    console.log("✅ Upstox Feed Authorized");
    console.log("WS URL:", wsUrl);

    // LOAD PROTO
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const protoPath = path.resolve(__dirname, "../proto/MarketDataFeed.proto");

    const root = await protobuf.load(protoPath);
    const FeedResponse = root.lookupType("com.upstox.marketdatafeeder.rpc.proto.FeedResponse") || root.lookupType("FeedResponse");

    // CREATE WS
    const ws = new WebSocket(wsUrl);

    ws.on("open", () => {
      console.log("✅ Upstox WebSocket Connected");

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
            mode: "full",
            instrumentKeys: keysToSubscribe,
          },
        })
      );
    });

    ws.on("error", (err) => {
      console.error(
        "❌ Upstox WebSocket Error:",
        err?.message || err
      );
    });

    ws.on("close", (code, reason) => {
      console.log(
        "⚠️ Upstox WebSocket Closed:",
        code,
        reason?.toString() || ""
      );

      setTimeout(() => {
        console.log("🔄 Reconnecting Upstox Feed...");
        startUpstoxMarketFeed(io);
      }, 10000);
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
          const isFull = !!value.ff;
          let ltp = 0;
          let close = 0;
          let volume = 0;

          if (isFull) {
            if (value.ff.marketFF) {
              ltp = value.ff.marketFF.ltpc?.ltp ?? 0;
              close = value.ff.marketFF.ltpc?.cp ?? 0;
              volume = value.ff.marketFF.eFeedDetails?.vtt ?? 0;
            } else if (value.ff.indexFF) {
              ltp = value.ff.indexFF.ltpc?.ltp ?? 0;
              close = value.ff.indexFF.ltpc?.cp ?? 0;
            }
          } else {
            ltp = value.ltpc?.ltp ?? 0;
            close = value.ltpc?.cp ?? 0;
          }

          const changeAmt = ltp - close;
          const changePercent = close ? (((ltp - close) / close) * 100) : 0;

          const symbol =
            allStocksMap[key] ||
            key.split("|").pop()?.replace(/_/g, " ").trim() ||
            key;

          return {
            symbol,
            instrumentKey: key,
            price: Number(ltp),
            change: Number(changeAmt),
            percent: Number(changePercent),
            volume: Number(volume),
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

        // Update in-memory price cache for order execution
        try {
          const priceCache = require("../services/priceCache.cjs");
          marketData.forEach((item) => {
            priceCache.setPrice(item.symbol, item.price);
          });
        } catch (err) {
          console.error("Failed to update price cache in upstoxMarketService:", err.message);
        }

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
            change: Number(item.percent),
          }));

        const stockData = marketData.filter((item) => !indexSymbols.has(item.symbol));

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
              change: Number(item.percent),
            };
          });

        const gainersData = [...stockData]
          .sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent))
          .slice(0, 5)
          .map((item) => ({
            symbol: item.symbol,
            price: item.price,
            change: Number(item.percent),
          }));

        const losersData = [...stockData]
          .sort((a, b) => parseFloat(a.percent) - parseFloat(b.percent))
          .slice(0, 5)
          .map((item) => ({
            symbol: item.symbol,
            price: item.price,
            change: Number(item.percent),
          }));

        const marketTableData = stockData.map((item) => {
          const details = getInstrumentDetails(item.symbol);
          return {
            symbol: item.symbol,
            company: details?.name || item.symbol,
            price: item.price,
            change: Number(item.percent),
            volume: formatVolumeValue(item.volume),
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
