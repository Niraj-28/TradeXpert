import axios from "axios";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { promisify } from "util";

const gunzip = promisify(zlib.gunzip);

const fetchExchangeInstruments = async (url) => {
  try {
    console.log(`⬇️ Downloading ${url}...`);
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const decompressed = await gunzip(response.data);
    const data = JSON.parse(decompressed.toString("utf-8"));
    return data;
  } catch (e) {
    console.error(`❌ Failed to fetch/parse from ${url}:`, e.message);
    return [];
  }
};

const CACHE_FILE = path.join(
  process.cwd(),
  "instruments-cache.json"
);

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Seeded popular Indian stocks as a fallback when no live cache exists
const SEEDED_STOCKS = [
  { instrument_key: "NSE_EQ|RELIANCE", trading_symbol: "RELIANCE", name: "Reliance Industries Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|TCS", trading_symbol: "TCS", name: "Tata Consultancy Services Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|INFY", trading_symbol: "INFY", name: "Infosys Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|HDFCBANK", trading_symbol: "HDFCBANK", name: "HDFC Bank Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|ICICIBANK", trading_symbol: "ICICIBANK", name: "ICICI Bank Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|SBIN", trading_symbol: "SBIN", name: "State Bank of India", exchange: "NSE" },
  { instrument_key: "NSE_EQ|BHARTIARTL", trading_symbol: "BHARTIARTL", name: "Bharti Airtel Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|ITC", trading_symbol: "ITC", name: "ITC Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|LICI", trading_symbol: "LICI", name: "Life Insurance Corporation of India", exchange: "NSE" },
  { instrument_key: "NSE_EQ|LT", trading_symbol: "LT", name: "Larsen & Toubro Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|TATASTEEL", trading_symbol: "TATASTEEL", name: "Tata Steel Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|TATAMOTORS", trading_symbol: "TATAMOTORS", name: "Tata Motors Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|WIPRO", trading_symbol: "WIPRO", name: "Wipro Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|AXISBANK", trading_symbol: "AXISBANK", name: "Axis Bank Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|KOTAKBANK", trading_symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|HINDUNILVR", trading_symbol: "HINDUNILVR", name: "Hindustan Unilever Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|ADANIENT", trading_symbol: "ADANIENT", name: "Adani Enterprises Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|BAJFINANCE", trading_symbol: "BAJFINANCE", name: "Bajaj Finance Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|MARUTI", trading_symbol: "MARUTI", name: "Maruti Suzuki India Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|SUNPHARMA", trading_symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|M&M", trading_symbol: "M&M", name: "Mahindra & Mahindra Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|ONGC", trading_symbol: "ONGC", name: "Oil & Natural Gas Corporation Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|POWERGRID", trading_symbol: "POWERGRID", name: "Power Grid Corporation of India Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|NTPC", trading_symbol: "NTPC", name: "NTPC Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|JIOFIN", trading_symbol: "JIOFIN", name: "Jio Financial Services Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|COALINDIA", trading_symbol: "COALINDIA", name: "Coal India Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|ADANIPORTS", trading_symbol: "ADANIPORTS", name: "Adani Ports and Special Economic Zone Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|ULTRACEMCO", trading_symbol: "ULTRACEMCO", name: "UltraTech Cement Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|GRASIM", trading_symbol: "GRASIM", name: "Grasim Industries Limited", exchange: "NSE" },
  { instrument_key: "NSE_EQ|JSWSTEEL", trading_symbol: "JSWSTEEL", name: "JSW Steel Limited", exchange: "NSE" }
];

let cachedInstruments = null;

const isRealStock = (item) => {
  if (!item) return false;
  const type = (item.instrument_type || item.instrumentType || "").toUpperCase();
  const isEquityType = type === "EQ" || type === "EQUITY" || type === "BE" || type === "SM" || type === "ST";
  if (!isEquityType) return false;

  const isin = (item.isin || "").toUpperCase();
  // Standard Indian equities (stocks) always have ISIN starting with "INE"
  if (!isin.startsWith("INE")) return false;

  const name = (item.name || item.company_name || "").toUpperCase();
  const symbol = (item.trading_symbol || item.tradingSymbol || "").toUpperCase();

  // 1. Exclude Sovereign Gold Bonds (SGB)
  if (symbol.startsWith("SGB")) return false;

  // 2. Exclude Gold/Silver commodity tracking symbols
  if (symbol.startsWith("GOLD") || symbol.startsWith("SILVER")) return false;

  // 3. Exclude REITs, InvITs, and RR (Rights) symbols
  if (
    symbol.endsWith("-RR") ||
    symbol.endsWith("_RR") ||
    symbol.includes("-REIT") ||
    name.includes("REIT") ||
    name.includes("INVIT") ||
    name.includes("INVESTMENT TRUST") ||
    name.includes("REAL ESTATE TRUST")
  ) {
    return false;
  }

  // 4. Exclude Mutual Funds, ETFs, Index Funds, Gilt Funds, and other Schemes/Funds
  if (
    name.includes("MUTUAL FUND") ||
    name.includes(" ETF") ||
    name.endsWith(" ETF") ||
    name.includes("GILT") ||
    name.includes("GROWTH") ||
    name.includes("INDEX FUND") ||
    name.includes("EXCHANGE TRADED") ||
    name.includes("EXCHANGE-TRADED") ||
    name.includes("FUND") ||
    name.includes("SCHEME") ||
    symbol.endsWith("BEES") ||
    symbol.includes("ETF")
  ) {
    return false;
  }

  // 5. Exclude Debt, Bonds, NCDs (Non-Convertible Debentures)
  if (
    name.includes("BOND") ||
    name.includes("NCD") ||
    name.includes("DEBENTURE") ||
    name.includes("SECURED") ||
    name.includes("UNSECURED")
  ) {
    return false;
  }

  return true;
};

const loadInstrumentsIntoMemory = () => {
  if (cachedInstruments) return cachedInstruments;
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      const rawList = cacheData.instruments || [];
      cachedInstruments = rawList.filter(isRealStock);
      console.log(`⚡ [INSTRUMENTS] Loaded ${cachedInstruments.length} equity instruments into memory cache.`);
    }
  } catch (err) {
    console.error("❌ [INSTRUMENTS] Error loading instruments cache from disk:", err.message);
  }
  if (!cachedInstruments || !cachedInstruments.length) {
    cachedInstruments = SEEDED_STOCKS.filter(isRealStock);
  }
  return cachedInstruments;
};

// FETCH ALL INSTRUMENTS FROM UPSTOX
export const fetchAllInstruments = async (accessToken) => {
  try {
    // CHECK CACHE FIRST
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      const cacheAge = Date.now() - cacheData.timestamp;
      if (cacheAge < CACHE_DURATION) {
        console.log("✅ Using cached instruments");
        cachedInstruments = cacheData.instruments.filter(isRealStock);
        return cachedInstruments;
      }
    }

    console.log("⬇️ Fetching instruments from public Upstox assets...");

    const nseUrl = "https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz";
    const bseUrl = "https://assets.upstox.com/market-quote/instruments/exchange/BSE.json.gz";

    const [nseData, bseData] = await Promise.all([
      fetchExchangeInstruments(nseUrl),
      fetchExchangeInstruments(bseUrl),
    ]);

    console.log(`Processing and filtering ${nseData.length + bseData.length} total instruments...`);

    const filterEquity = (list) => {
      if (!Array.isArray(list)) return [];
      return list.filter(isRealStock);
    };

    const nseStocks = filterEquity(nseData);
    const bseStocks = filterEquity(bseData);

    const instruments = [...nseStocks, ...bseStocks];

    if (instruments.length > 0) {
      // SAVE TO CACHE
      fs.writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), instruments }));
      console.log(`✅ Saved ${instruments.length} equity instruments to cache.`);
      cachedInstruments = instruments;
      return instruments;
    } else {
      throw new Error("No equity instruments found after downloading");
    }
  } catch (error) {
    console.error("❌ Error fetching instruments:", error.message);
    // FALLBACK TO CACHE IF AVAILABLE
    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
        cachedInstruments = cacheData.instruments;
        return cachedInstruments;
      } catch (e) {}
    }
    cachedInstruments = SEEDED_STOCKS;
    return cachedInstruments;
  }
};

// Search cached or fetched instruments by query (trading symbol, name, isin, instrument_key)
export const searchInstruments = (query) => {
  try {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return [];

    const items = loadInstrumentsIntoMemory();

    const matched = [];
    for (const it of items) {
      const trading = (it.trading_symbol || it.tradingSymbol || "").toLowerCase();
      const name = (it.name || it.company_name || "").toLowerCase();
      const isin = (it.isin || "").toLowerCase();
      const key = (it.instrument_key || "").toLowerCase();

      if (trading.includes(q) || name.includes(q) || isin.includes(q) || key.includes(q)) {
        matched.push(it);
      }
    }

    // Sort to prioritize exact, prefix, and equity/high-quality matches
    matched.sort((a, b) => {
      const symbolA = (a.trading_symbol || a.tradingSymbol || "").toLowerCase();
      const symbolB = (b.trading_symbol || b.tradingSymbol || "").toLowerCase();
      
      const nameA = (a.name || a.company_name || "").toLowerCase();
      const nameB = (b.name || b.company_name || "").toLowerCase();

      // 1. Exact matches on symbol
      const exactA = symbolA === q ? 1 : 0;
      const exactB = symbolB === q ? 1 : 0;
      if (exactA !== exactB) return exactB - exactA;

      // 2. Starts with match on symbol
      const startsA = symbolA.startsWith(q) ? 1 : 0;
      const startsB = symbolB.startsWith(q) ? 1 : 0;
      if (startsA !== startsB) return startsB - startsA;

      // 3. Name starts with query
      const nameStartsA = nameA.startsWith(q) ? 1 : 0;
      const nameStartsB = nameB.startsWith(q) ? 1 : 0;
      if (nameStartsA !== nameStartsB) return nameStartsB - nameStartsA;

      // 4. Symbol contains query
      const containsSymA = symbolA.includes(q) ? 1 : 0;
      const containsSymB = symbolB.includes(q) ? 1 : 0;
      if (containsSymA !== containsSymB) return containsSymB - containsSymA;

      // Fallback: alphabetical symbol
      return symbolA.localeCompare(symbolB);
    });

    return matched.slice(0, 100);
  } catch (e) {
    console.error("Search instruments error:", e.message);
    return [];
  }
};

// Get instrument key and company name for a trading symbol
export const getInstrumentDetails = (symbol) => {
  try {
    if (!symbol) return null;
    const sym = String(symbol).trim().toUpperCase();
    const items = loadInstrumentsIntoMemory();

    // Prefer NSE EQ first
    let match = items.find((it) => {
      const trading = (it.trading_symbol || it.tradingSymbol || "").toUpperCase();
      const exchange = (it.exchange || "").toUpperCase();
      const type = (it.instrument_type || it.instrumentType || "").toUpperCase();
      return trading === sym && (exchange === "NSE" && (type === "EQ" || type === "EQUITY"));
    });

    // If not found, any match for the symbol
    if (!match) {
      match = items.find((it) => {
        const trading = (it.trading_symbol || it.tradingSymbol || "").toUpperCase();
        return trading === sym;
      });
    }

    if (match) {
      return {
        instrument_key: match.instrument_key || match.instrumentKey,
        name: match.name || match.company_name || match.trading_symbol || match.tradingSymbol,
      };
    }
    return null;
  } catch (e) {
    console.error("getInstrumentDetails error:", e.message);
    return null;
  }
};

