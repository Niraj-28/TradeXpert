import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket/socket";

const MarketContext = createContext();

const fallbackStocks = [
  { symbol: "RELIANCE", price: 2945, change: 2.3 },
  { symbol: "TCS", price: 3812, change: -1.2 },
  { symbol: "INFY", price: 1542, change: 1.8 },
  { symbol: "HDFCBANK", price: 1690, change: 2.9 },
  { symbol: "ICICIBANK", price: 1128, change: -0.8 },
  { symbol: "SBIN", price: 967, change: 1.5 },
  { symbol: "AXISBANK", price: 1185, change: -0.4 },
  { symbol: "ITC", price: 446, change: 1.1 },
];

const fallbackIndices = [
  { symbol: "NIFTY 50", price: 24910, change: 140 },
  { symbol: "BANK NIFTY", price: 54800, change: 220 },
  { symbol: "SENSEX", price: 81200, change: 340 },
  { symbol: "FINNIFTY", price: 24200, change: 90 },
];

export const MarketProvider = ({ children }) => {
  const [stocks, setStocks] = useState(fallbackStocks);
  const [indices, setIndices] = useState(fallbackIndices);

  useEffect(() => {
    const handleMarketData = (data) => {
      if (!Array.isArray(data)) return;

      const parsedData = data.map((item) => ({
        symbol: item.symbol || item.name || item.tradingsymbol || "N/A",
        price: Number(item.price || item.last_price || item.ltp || 0).toFixed(2),
        change: Number(item.change || item.net_change || 0).toFixed(2),
        high: item.high || item.ohlc?.high || 0,
        low: item.low || item.ohlc?.low || 0,
        open: item.open || item.ohlc?.open || 0,
        close: item.close || item.ohlc?.close || 0,
      }));

      const indexRegex = /NIFTY|SENSEX|BANK|FIN/i;
      const updatedIndices = parsedData.filter((item) =>
        indexRegex.test(item.symbol)
      );
      const updatedStocks = parsedData.filter(
        (item) => !indexRegex.test(item.symbol)
      );

      setIndices(updatedIndices);
      setStocks(updatedStocks);
    };

    socket.on("marketData", handleMarketData);

    return () => {
      socket.off("marketData", handleMarketData);
    };
  }, []);

  return (
    <MarketContext.Provider
      value={{
        stocks,
        indices,
        marketData: stocks,
        indicesData: indices,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  return useContext(MarketContext);
};