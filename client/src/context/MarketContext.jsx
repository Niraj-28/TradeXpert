import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { socket } from "../services/socket";

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);

  const [indices, setIndices] = useState([]);

  const [trendingStocks, setTrendingStocks] =
    useState([]);

  const [topGainers, setTopGainers] =
    useState([]);

  const [topLosers, setTopLosers] =
    useState([]);

  const [marketStocks, setMarketStocks] =
    useState([]);

  const [sectors, setSectors] =
    useState([]);

  useEffect(() => {

    /*
    |--------------------------------------------------------------------------
    | REGISTER LISTENERS FIRST
    |--------------------------------------------------------------------------
    */

    socket.on("connect", () => {
      console.log("✅ Socket Connected");

      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");

      setConnected(false);
    });

    socket.on("market-indices", (data) => {
      console.log("INDICES:", data);

      // Expected shape from server:
      // - [{ name, value, change }] (value may be number or string)
      // Normalize so UI always gets a usable numeric value.
      if (!Array.isArray(data)) {
        setIndices([]);
        return;
      }

      const normalized = data.map((item) => {
        const name = item?.name ?? "—";

        // Some emitters send `value` as number, others send a string like "24,850".
        const rawValue = item?.value;
        let value = "—";
        if (rawValue === null || rawValue === undefined) {
          value = "—";
        } else {
          const numeric = Number(String(rawValue).replace(/,/g, ""));
          value = Number.isFinite(numeric) ? numeric : "—";
        }

        const changeRaw = item?.change;
        const change = Number(changeRaw);

        return {
          name,
          value,
          change: Number.isFinite(change) ? change : 0,
        };
      });

      setIndices(normalized);
    });

    socket.on("trending-stocks", (data) => {
      console.log("TRENDING:", data);

      setTrendingStocks(data);
    });

    socket.on("top-gainers", (data) => {
      console.log("GAINERS:", data);

      setTopGainers(data);
    });

    socket.on("top-losers", (data) => {
      console.log("LOSERS:", data);

      setTopLosers(data);
    });

    socket.on("market-table", (data) => {
      console.log("TABLE:", data);

      setMarketStocks(data);
    });

    socket.on("sector-performance", (data) => {
      console.log("SECTORS:", data);

      setSectors(data);
    });

      const processMarketData = (data) => {
      if (!Array.isArray(data)) return;

      // Some feeds send precomputed card payloads with different shapes.
      // Normalize indices payloads so indices UI can always render.
      // If `market-indices` arrives separately, these helpers won't be used.

      const normalizeIndexValue = (v) => {
        if (v === null || v === undefined) return "—";
        const s = String(v).replace(/[^0-9.\-]/g, "").trim();
        const n = Number(s);
        return Number.isFinite(n) ? n : "—";
      };

      const indexSymbols = new Set([
        "NIFTY 50",
        "BANK NIFTY",
        "BANKNIFTY",
        "SENSEX",
        "FIN NIFTY",
        "FINNIFTY",
      ]);

      const indicesData = data
        .filter((item) => indexSymbols.has(item.symbol))
        .map((item) => ({
          name: item.symbol,
          value: `₹${item.price}`,
          change: Number(item.change),
        }));

      const stockData = data.filter(
        (item) => !indexSymbols.has(item.symbol)
      );

      const companyMap = {
        RELIANCE: "Reliance Industries",
        TCS: "Tata Consultancy Services",
        INFY: "Infosys",
        HDFCBANK: "HDFC Bank",
        ICICIBANK: "ICICI Bank",
        SBIN: "State Bank of India",
      };

      // Normalize values coming from server (which can be strings like "—" or even undefined).
      // This prevents UI rendering "NA" when value/company is missing.
      const normalizeString = (v) => {
        if (v === null || v === undefined) return "—";
        const s = String(v).trim();
        const lowered = s.toLowerCase();

        // Treat typical placeholders as missing.
        if (
          !s ||
          lowered === "na" ||
          lowered === "n/a" ||
          lowered === "null" ||
          lowered === "undefined" ||
          lowered === "--"
        ) {
          return "—";
        }

        return s;
      };

      const trendingData = stockData.slice(0, 6).map((item) => ({
        symbol: normalizeString(
          item.symbol || item.instrument || item.company
        ),
        price: item.price,
        change: item.change,
      }));

      const marketTableData = stockData.map((item) => ({
        symbol: normalizeString(item.symbol || item.instrument),
        company: normalizeString(
          companyMap[item.symbol] || item.company || item.symbol || item.instrument
        ),
        price: item.price,
        change: item.change,
        volume: normalizeString(item.volume),
      }));

      const gainersData = [...stockData]
        .sort((a, b) => parseFloat(b.change) - parseFloat(a.change))
        .slice(0, 3)
        .map((item) => ({
          symbol: normalizeString(item.symbol),
          price: item.price,
          change: item.change,
        }));

      const losersData = [...stockData]
        .sort((a, b) => parseFloat(a.change) - parseFloat(b.change))
        .slice(0, 3)
        .map((item) => ({
          symbol: normalizeString(item.symbol),
          price: item.price,
          change: item.change,
        }));

      setIndices(indicesData);
      setTrendingStocks(trendingData);
      setMarketStocks(marketTableData);
      setTopGainers(gainersData);
      setTopLosers(losersData);
    };

    socket.on("marketData", (data) => {
      console.log("MARKET DATA:", data);
      processMarketData(data);
    });

    // Some backends emit only "market-data".
    socket.on("market-data", (data) => {
      console.log("MARKET DATA:", data);
      processMarketData(data);
    });

    // Ensure that if the websocket feed already emits fully prepared card payloads,
    // we don't accidentally overwrite them with mismatched shape.
    socket.on("market-indices", (data) => {
      if (Array.isArray(data)) setIndices(data);
    });

    socket.on("trending-stocks", (data) => {
      if (Array.isArray(data)) setTrendingStocks(data);
    });

    socket.on("market-table", (data) => {
      if (Array.isArray(data)) setMarketStocks(data);
    });

    socket.on("top-gainers", (data) => {
      if (Array.isArray(data)) setTopGainers(data);
    });

    socket.on("top-losers", (data) => {
      if (Array.isArray(data)) setTopLosers(data);
    });

    socket.on("sector-performance", (data) => {
      if (Array.isArray(data)) setSectors(data);
    });

    /*
    |--------------------------------------------------------------------------
    | CONNECT AFTER LISTENERS
    |--------------------------------------------------------------------------
    */


    return () => {

      socket.off("connect");
      socket.off("disconnect");

      socket.off("market-indices");
      socket.off("trending-stocks");

      socket.off("top-gainers");
      socket.off("top-losers");

      socket.off("market-table");
      socket.off("sector-performance");
      socket.off("marketData");
      socket.off("market-data");

    };
  }, []);

  return (
    <MarketContext.Provider
      value={{
        connected,
        indices,
        trendingStocks,
        topGainers,
        topLosers,
        marketStocks,
        sectors,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () =>
  useContext(MarketContext);