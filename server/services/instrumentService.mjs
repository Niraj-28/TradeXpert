import axios from "axios";
import fs from "fs";
import path from "path";

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

// FETCH ALL INSTRUMENTS FROM UPSTOX
export const fetchAllInstruments = async (accessToken) => {
  try {
    // CHECK CACHE FIRST
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      const cacheAge = Date.now() - cacheData.timestamp;
      if (cacheAge < CACHE_DURATION) {
        console.log("✅ Using cached instruments");
        return cacheData.instruments;
      }
    }

    // FETCH FROM UPSTOX API
    console.log("⬇️  Fetching instruments from Upstox...");

    const response = await axios.get("https://api-v2.upstox.com/v2/market/instruments", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const allInstruments = response.data.data || [];

    // RETURN ALL NSE & BSE EQUITY STOCKS
    const nseStocks = allInstruments.filter((item) => item.exchange === "NSE_EQ" && item.instrument_type === "EQUITY");
    const bseStocks = allInstruments.filter((item) => item.exchange === "BSE_EQ" && item.instrument_type === "EQUITY");

    const instruments = [...nseStocks, ...bseStocks];

    // SAVE TO CACHE
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), instruments }));

    console.log(`✅ Fetched ${instruments.length} instruments`);

    return instruments;
  } catch (error) {
    console.error("❌ Error fetching instruments:", error.message);
    // FALLBACK TO CACHE IF AVAILABLE
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      return cacheData.instruments;
    }
    return [];
  }
};

// Search cached or fetched instruments by query (trading symbol, name, isin, instrument_key)
export const searchInstruments = (query) => {
  try {
    const q = String(query || "").trim().toLowerCase();

    let items = [];
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      items = cacheData.instruments || [];
    }

    // Seed fallback stocks if cache is not created or empty
    if (!items.length) {
      items = SEEDED_STOCKS;
    }

    const results = items.filter((it) => {
      const trading = (it.trading_symbol || it.tradingSymbol || "").toLowerCase();
      const name = (it.name || it.company_name || "").toLowerCase();
      const isin = (it.isin || "").toLowerCase();
      const key = (it.instrument_key || "").toLowerCase();

      return trading.includes(q) || name.includes(q) || isin.includes(q) || key.includes(q);
    });

    return results.slice(0, 100);
  } catch (e) {
    console.error("Search instruments error:", e.message);
    return [];
  }
};
