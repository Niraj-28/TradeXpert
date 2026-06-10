import { useState, useEffect } from "react";
import { useMarket } from "../../context/MarketContext";
import { addToWatchlist } from "../../services/watchlistService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Plus, Check, TrendingUp, ShoppingCart, BarChart2 } from "lucide-react";
import DiscoverStocks from "./DiscoverStocks";
import StockLogo from "../ui/StockLogo";

const Sparkline = ({ data = [], width = 110, height = 30 }) => {
  if (!Array.isArray(data) || data.length < 2) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto", width, height }}>
        <svg width={width} height={height}>
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1.5" strokeDasharray="3,3" />
        </svg>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const padding = range * 0.15;
  const adjMin = min - padding;
  const adjMax = max + padding;
  const adjRange = adjMax - adjMin;

  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((val - adjMin) / adjRange) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const isPositive = data[data.length - 1] >= data[0];
  const strokeColor = isPositive ? "#00b074" : "#ff3b30";

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto", width, height }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
};

const MarketTable = ({ onTrade }) => {
  const { marketStocks } = useMarket();
  const { user } = useAuth();
  const [addedSymbols, setAddedSymbols] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddWatchlist = async (symbol) => {
    if (!user) {
      toast.error("Please sign in to add stocks to your watchlist");
      return;
    }
    try {
      await addToWatchlist(symbol.toUpperCase());
      toast.success(`${symbol} added to watchlist`);
      setAddedSymbols((prev) => new Set([...prev, symbol.toUpperCase()]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Already in watchlist");
    }
  };

  const displayedStocks = marketStocks?.slice(0, 10) || [];

  return (
    <div className="market-table-section-card">
      <div className="market-table-header">
        <div className="market-table-header-left">
          <div className="title-with-icon">
            <h2>Live Market Dashboard</h2>
          </div>
          <p>Real-time activity metrics from NSE/BSE equities</p>
        </div>

        <div className="market-table-header-search">
          <DiscoverStocks onTrade={onTrade} />
        </div>
      </div>

      {isMobile ? (
        <div className="market-list-mobile">
          {displayedStocks.length ? (
            displayedStocks.map((stock, index) => {
              const change = Number(stock.change ?? 0);
              const isPositive = change >= 0;
              const displayPrice = stock.price === "—" || stock.price === undefined || isNaN(Number(stock.price))
                ? "—"
                : `₹${Number(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

              return (
                <div
                  key={`${stock.symbol}-${index}`}
                  className="market-list-row-mobile clickable-row"
                  onClick={() => onTrade({
                    symbol: stock.symbol,
                    name: stock.company,
                    price: parseFloat(stock.price) || 0,
                  }, "BUY")}
                >
                  <div className="left-block">
                    <StockLogo symbol={stock.symbol} size={36} />
                    <div className="symbol-info">
                      <span className="sym-text">{stock.symbol}</span>
                      <span className="company-text">{stock.company}</span>
                    </div>
                  </div>

                  <div className="center-block">
                    <Sparkline data={stock.history} width={75} height={24} />
                  </div>

                  <div className="right-block">
                    <div className="price-change-wrap">
                      <span className="price-text">{displayPrice}</span>
                      <span className={`change-text ${isPositive ? "positive" : "negative"}`}>
                        {isPositive ? "+" : ""}{change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="table-empty-row" style={{ padding: "20px", textAlign: "center" }}>
              No live market data available yet.
            </div>
          )}
        </div>
      ) : (
        <div className="market-table-responsive-wrapper">
          <table className="market-table-widget">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th className="num-align">Price</th>
                <th className="num-align">Change</th>
                <th style={{ textAlign: "center", width: "150px" }}>Trend</th>
                <th className="actions-align">Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayedStocks.length ? (
                displayedStocks.map((stock, index) => {
                  const change = Number(stock.change ?? 0);
                  const isPositive = change >= 0;
                  const isAdded = addedSymbols.has(stock.symbol.toUpperCase());
                  const displayPrice = stock.price === "—" || stock.price === undefined || isNaN(Number(stock.price))
                    ? "—"
                    : `₹${Number(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                  return (
                    <tr
                      key={`${stock.symbol}-${index}`}
                      className="clickable-row"
                      onClick={() => onTrade({
                        symbol: stock.symbol,
                        name: stock.company,
                        price: parseFloat(stock.price) || 0,
                      }, "BUY")}
                    >
                      <td className="stock-symbol-cell">
                        <div className="symbol-flex-wrap" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <StockLogo symbol={stock.symbol} size={32} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span className="sym-text">{stock.symbol}</span>
                            <span className="ex-badge" style={{ alignSelf: "flex-start", marginTop: "2px" }}>NSE</span>
                          </div>
                        </div>
                      </td>
                      <td className="stock-company-cell">{stock.company}</td>
                      <td className="stock-price-cell num-align">{displayPrice}</td>
                      <td className={`stock-change-cell num-align ${isPositive ? "positive" : "negative"}`}>
                        {isPositive ? "+" : ""}{change.toFixed(2)}%
                      </td>
                      <td className="stock-chart-cell" style={{ verticalAlign: "middle", textAlign: "center", width: "150px" }}>
                        <Sparkline data={stock.history} />
                      </td>
                      <td className="stock-actions-cell actions-align">
                        <div className="actions-flex-wrap">
                          {/* BUY Trade Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTrade({
                                symbol: stock.symbol,
                                name: stock.company,
                                price: parseFloat(stock.price) || 0,
                              }, "BUY");
                            }}
                            className="market-action-btn buy"
                          >
                            <ShoppingCart size={13} />
                            Buy
                          </button>

                          {/* SELL Trade Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTrade({
                                symbol: stock.symbol,
                                name: stock.company,
                                price: parseFloat(stock.price) || 0,
                              }, "SELL");
                            }}
                            className="market-action-btn sell"
                          >
                            <TrendingUp size={13} />
                            Sell
                          </button>

                          {/* Add to Watchlist Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddWatchlist(stock.symbol);
                            }}
                            disabled={isAdded}
                            className={`market-action-btn watch ${isAdded ? "added" : ""}`}
                            title="Add to Watchlist"
                          >
                            {isAdded ? (
                              <>
                                <Check size={13} />
                              </>
                            ) : (
                              <>
                                <Plus size={13} />
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="table-empty-row">
                    No live market data available yet. Please check your socket connection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarketTable;