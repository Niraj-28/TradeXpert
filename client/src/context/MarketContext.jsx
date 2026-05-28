import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {

  /* ========================================
     MARKET INDICES
  ======================================== */

  const [indices, setIndices] = useState([
    {
      name: "NIFTY 50",
      value: 24850.35,
      change: "+152.40",
      percent: "+0.61%",
    },

    {
      name: "BANKNIFTY",
      value: 52310.80,
      change: "+341.15",
      percent: "+0.68%",
    },

    {
      name: "SENSEX",
      value: 81420.72,
      change: "+428.91",
      percent: "+0.53%",
    },

    {
      name: "FINNIFTY",
      value: 24182.45,
      change: "+108.22",
      percent: "+0.44%",
    },
  ]);

  /* ========================================
     TRENDING STOCKS
  ======================================== */

  const [trendingStocks, setTrendingStocks] =
    useState([
      {
        symbol: "RELIANCE",
        price: 3124.45,
        change: "+1.84%",
      },

      {
        symbol: "TCS",
        price: 4210.15,
        change: "+0.92%",
      },

      {
        symbol: "HDFCBANK",
        price: 1742.30,
        change: "+1.12%",
      },

      {
        symbol: "INFY",
        price: 1568.40,
        change: "-0.44%",
      },

      {
        symbol: "ICICIBANK",
        price: 1224.80,
        change: "+1.66%",
      },
    ]);

  /* ========================================
     TOP GAINERS
  ======================================== */

  const [topGainers, setTopGainers] = useState([
    {
      symbol: "ADANIPORTS",
      price: 1542.80,
      percent: "+4.42%",
    },

    {
      symbol: "SBIN",
      price: 924.45,
      percent: "+3.66%",
    },

    {
      symbol: "TATASTEEL",
      price: 176.52,
      percent: "+2.95%",
    },

    {
      symbol: "HINDALCO",
      price: 684.10,
      percent: "+2.64%",
    },
  ]);

  /* ========================================
     TOP LOSERS
  ======================================== */

  const [topLosers, setTopLosers] = useState([
    {
      symbol: "WIPRO",
      price: 542.40,
      percent: "-2.18%",
    },

    {
      symbol: "TECHM",
      price: 1314.72,
      percent: "-1.72%",
    },

    {
      symbol: "BAJAJFINSV",
      price: 1628.55,
      percent: "-1.28%",
    },

    {
      symbol: "NESTLEIND",
      price: 2421.20,
      percent: "-0.96%",
    },
  ]);

  /* ========================================
     LIVE MARKET TABLE
  ======================================== */

  const [marketStocks, setMarketStocks] =
    useState([
      {
        symbol: "RELIANCE",
        company: "Reliance Industries",
        price: 3124.45,
        change: "+1.84%",
        volume: "12.5M",
      },

      {
        symbol: "TCS",
        company: "Tata Consultancy",
        price: 4210.15,
        change: "+0.92%",
        volume: "3.8M",
      },

      {
        symbol: "INFY",
        company: "Infosys Ltd",
        price: 1568.40,
        change: "-0.44%",
        volume: "8.1M",
      },

      {
        symbol: "HDFCBANK",
        company: "HDFC Bank",
        price: 1742.30,
        change: "+1.12%",
        volume: "9.7M",
      },

      {
        symbol: "ICICIBANK",
        company: "ICICI Bank",
        price: 1224.80,
        change: "+1.66%",
        volume: "10.3M",
      },
    ]);

  /* ========================================
     SECTOR PERFORMANCE
  ======================================== */

  const [sectors, setSectors] = useState([
    {
      sector: "Banking",
      percent: "+1.44%",
    },

    {
      sector: "IT",
      percent: "+0.84%",
    },

    {
      sector: "Pharma",
      percent: "-0.24%",
    },

    {
      sector: "Auto",
      percent: "+1.18%",
    },

    {
      sector: "Energy",
      percent: "+2.04%",
    },
  ]);

  /* ========================================
     MOCK REALTIME UPDATES
  ======================================== */

  useEffect(() => {

    const interval = setInterval(() => {

      setIndices((prev) =>
        prev.map((item) => ({
          ...item,
          value:
            item.value +
            (Math.random() * 10 - 5),
        }))
      );

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <MarketContext.Provider
      value={{
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