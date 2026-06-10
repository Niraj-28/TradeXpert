import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { getHoldings } from "../../services/holdingService";
import PortfolioAnalytics from "../../components/portfolio/PortfolioAnalytics";
import StockLogo from "../../components/ui/StockLogo";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getUserProfile } from "../../services/authService";
import {
  ArrowUpRight, ArrowDownRight, Briefcase, TrendingUp,
  TrendingDown, Activity, RefreshCw, AlertCircle, Sparkles
} from "lucide-react";

// Helper to format currency
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

// Seed deterministic prices for non-ticker stocks
const getInitialPrice = (symbol) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const open = Math.abs(hash % 2900) + 100; // Rs 100 - 3000
  const changePercent = ((hash % 100) / 25) - 2; // -2% to +2%
  const price = open * (1 + changePercent / 100);

  return {
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(changePercent.toFixed(2)),
    open: parseFloat(open.toFixed(2)),
    close: parseFloat(open.toFixed(2)),
  };
};

const Sparkline = ({ data = [], width = 75, height = 24 }) => {
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

const Portfolio = () => {
  const { marketStocks } = useMarket();
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cashBalance, setCashBalance] = useState(1000000);
  const [activePortfolioTab, setActivePortfolioTab] = useState("holdings"); // "holdings" | "positions"
  const [squaringOff, setSquaringOff] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Client-side simulated prices for custom holdings
  const [simulatedPrices, setSimulatedPrices] = useState({});

  const fetchHoldingsData = async () => {
    try {
      setLoading(true);
      const data = await getHoldings();
      setHoldings(data.holdings || []);

      const profile = await getUserProfile();
      setCashBalance(profile.balance !== undefined ? profile.balance : 1000000);
    } catch (error) {
      console.error("Fetch holdings error:", error);
      toast.error("Failed to load your portfolio holdings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldingsData();
  }, []);

  // Simulate price changes on every interval (mirrors the socket update cycle)
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedPrices((prev) => {
        const updated = { ...prev };
        holdings.forEach((item) => {
          const sym = item.symbol.toUpperCase();
          const isCore = marketStocks.some(
            (s) => s.symbol.toUpperCase() === sym
          );

          if (!isCore) {
            const current = updated[sym] || getInitialPrice(sym);
            const deltaPercent = (Math.random() * 0.3 - 0.15) / 100; // ±0.15% fluctuation
            const newPrice = current.price * (1 + deltaPercent);
            const initialData = getInitialPrice(sym);
            const refClose = initialData.close;
            const newChange = ((newPrice - refClose) / refClose) * 100;

            updated[sym] = {
              ...current,
              price: parseFloat(newPrice.toFixed(2)),
              change: parseFloat(newChange.toFixed(2)),
            };
          }
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [holdings, marketStocks]);

  // Enrich database holdings with live prices and calculate PnL
  const enrichedHoldings = useMemo(() => {
    return holdings.map((holding) => {
      // 1. Check if the stock exists in the active market feed (marketStocks)
      const liveStock = marketStocks.find(
        (s) => s.symbol.toUpperCase() === holding.symbol.toUpperCase()
      );

      let ltp = holding.avgPrice;
      let change = 0;

      if (liveStock) {
        ltp = parseFloat(liveStock.price) || holding.avgPrice;
        change = parseFloat(liveStock.change) || 0;
      } else {
        // Fallback to simulated price
        const sim = simulatedPrices[holding.symbol.toUpperCase()] || getInitialPrice(holding.symbol);
        ltp = sim.price;
        change = sim.change;
      }

      const isIntraday = holding.productType?.toUpperCase() === "INTRADAY";
      const qty = Number(holding.quantity);

      let investedVal = 0;
      let currentVal = 0;
      let totalPnL = 0;

      if (isIntraday) {
        // Deployed margin is 20% (5x leverage) of absolute position size
        investedVal = (Math.abs(qty) * holding.avgPrice) / 5;
        // P&L calculation handles short (negative qty) and long (positive qty)
        if (qty < 0) {
          totalPnL = Math.abs(qty) * (holding.avgPrice - ltp);
        } else {
          totalPnL = qty * (ltp - holding.avgPrice);
        }
        currentVal = investedVal + totalPnL;
      } else {
        // Delivery
        investedVal = qty * holding.avgPrice;
        currentVal = qty * ltp;
        totalPnL = currentVal - investedVal;
      }

      const totalPnLPct = investedVal > 0 ? (totalPnL / investedVal) * 100 : 0;

      // Daily PnL estimate (using change percent relative to price)
      const dayPnL = currentVal * (change / 100);

      return {
        ...holding,
        ltp,
        change,
        history: liveStock ? liveStock.history : [],
        investedVal,
        currentVal,
        totalPnL,
        totalPnLPct,
        dayPnL,
      };
    });
  }, [holdings, marketStocks, simulatedPrices]);

  const holdingsList = useMemo(() => {
    return enrichedHoldings.filter(h => !h.productType || h.productType.toUpperCase() === "DELIVERY");
  }, [enrichedHoldings]);

  const positionsList = useMemo(() => {
    return enrichedHoldings.filter(h => h.productType && h.productType.toUpperCase() === "INTRADAY");
  }, [enrichedHoldings]);

  const activeList = activePortfolioTab === "holdings" ? holdingsList : positionsList;

  const handleSimulateSquareOff = async () => {
    if (positionsList.length === 0) {
      toast.error("No active intraday positions to square off!");
      return;
    }

    try {
      setSquaringOff(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/auto-square-off", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || `Squared off ${data.count} intraday positions successfully!`);
        fetchHoldingsData();
      } else {
        toast.error(data.message || "Failed to trigger auto square-off");
      }
    } catch (error) {
      console.error("Square-off simulation error:", error);
      toast.error("Error triggering square-off simulation");
    } finally {
      setSquaringOff(false);
    }
  };

  // Compute portfolio calculations
  const summary = useMemo(() => {
    const totalInvested = enrichedHoldings.reduce((sum, h) => sum + h.investedVal, 0);
    const totalCurrentValue = enrichedHoldings.reduce((sum, h) => sum + h.currentVal, 0);
    const totalPnL = totalCurrentValue - totalInvested;
    const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    const cash = cashBalance;
    const totalPortfolioValue = totalCurrentValue + cash;
    const dayPnL = enrichedHoldings.reduce((sum, h) => sum + h.dayPnL, 0);

    return {
      invested: totalInvested,
      currentValue: totalCurrentValue,
      totalPnL,
      totalPnLPct,
      cash,
      totalValue: totalPortfolioValue,
      dayPnL,
    };
  }, [enrichedHoldings, cashBalance]);

  const isPos = summary.totalPnL >= 0;
  const isDayPos = summary.dayPnL >= 0;

  const renderMobileHoldingsList = () => {
    return (
      <div className="portfolio-list-mobile">
        <AnimatePresence mode="wait">
          {activeList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }} key="empty-mobile">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <Briefcase size={28} style={{ color: "#cbd5e1" }} />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  No active {activePortfolioTab === "holdings" ? "holdings (Delivery)" : "positions (Intraday)"}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Go to Markets to place an order.
                </span>
              </div>
            </div>
          ) : (
            activeList.map((r) => {
              const isCardPos = r.totalPnL >= 0;
              return (
                <motion.div
                  key={`${r.symbol}-${r.productType}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="portfolio-list-row-mobile clickable-row"
                  onClick={() => navigate(`/stocks/${r.symbol.toUpperCase()}`)}
                >
                  <div className="left-block">
                    <StockLogo symbol={r.symbol} size={36} />
                    <div className="symbol-info">
                      <span className="sym-text">{r.symbol}</span>
                      <span className="company-text">
                        {r.quantity < 0 ? (
                          <span style={{
                            color: "#ef4444",
                            background: "rgba(239, 68, 68, 0.1)",
                            padding: "1px 4px",
                            borderRadius: "3px",
                            fontSize: "10px",
                            fontWeight: "600",
                            marginRight: "4px"
                          }}>
                            SHORT
                          </span>
                        ) : null}
                        {Math.abs(r.quantity)} qty • Avg ₹{r.avgPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="center-block">
                    <Sparkline data={r.history} width={75} height={24} />
                  </div>

                  <div className="right-block">
                    <span className="price-text">{formatINR(r.currentVal)}</span>
                    <span className={`change-text ${isCardPos ? "positive" : "negative"}`}>
                      {isCardPos ? "+" : ""}{r.totalPnL.toFixed(2)} ({r.totalPnLPct.toFixed(2)}%)
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="portfolio-page">
      {/* HERO SECTION */}
      <div className="portfolio-hero">
        <div className="portfolio-hero-left">
          <div className="portfolio-hero-title-row">
            <h1>Virtual Portfolio</h1>
            <button
              onClick={handleSimulateSquareOff}
              disabled={squaringOff}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: squaringOff ? "rgba(148, 163, 184, 0.08)" : "rgba(239, 68, 68, 0.06)",
                color: squaringOff ? "#94a3b8" : "#ef4444",
                border: squaringOff ? "1px solid rgba(148, 163, 184, 0.2)" : "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: "500",
                cursor: squaringOff ? "not-allowed" : "pointer",
                fontFamily: "Poppins, sans-serif",
                transition: "all 0.2s ease",
                marginLeft: "8px",
                boxShadow: "none"
              }}
              onMouseEnter={(e) => {
                if (!squaringOff) {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!squaringOff) {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.25)";
                }
              }}
            >
              <RefreshCw className={squaringOff ? "animate-spin" : ""} size={12} />
              <span>{squaringOff ? "Squaring off..." : "Simulate Square-off"}</span>
            </button>
          </div>
          <p>Real-time valuation of your stock holdings and cash balance</p>
        </div>
        <div className="portfolio-badge-row">
          <div className="portfolio-badge">
            <span className="badge-label">Unique Assets</span>
            <span className="badge-value">{holdings.length}</span>
          </div>
          <div className="portfolio-badge">
            <span className="badge-label">Available Cash</span>
            <span className="badge-value">{formatINR(summary.cash)}</span>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS GRID */}
      <section className="portfolio-summary-grid">
        <div className="portfolio-summary-card">
          <div className="summary-card-label">Total Portfolio Net Worth</div>
          <div className="summary-card-value">{formatINR(summary.totalValue)}</div>
          <div className="summary-card-sub">Holdings Value + Cash</div>
        </div>

        <div className="portfolio-summary-card">
          <div className="summary-card-label">Total Returns (P&L)</div>
          <div className={`summary-card-value ${isPos ? "positive" : "negative"}`}>
            {isPos ? "+" : ""}{formatINR(summary.totalPnL)} ({summary.totalPnLPct.toFixed(2)}%)
          </div>
          <div className="summary-card-sub">All-time performance</div>
        </div>

        <div className="portfolio-summary-card">
          <div className="summary-card-label">Total Capital Invested</div>
          <div className="summary-card-value">{formatINR(summary.invested)}</div>
          <div className="summary-card-sub">Deployed margin value</div>
        </div>

        <div className="portfolio-summary-card">
          <div className="summary-card-label">Today's Returns</div>
          <div className={`summary-card-value ${isDayPos ? "positive" : "negative"}`}>
            {isDayPos ? "+" : ""}{formatINR(summary.dayPnL)}
          </div>
          <div className="summary-card-sub">Est. day change based on LTP</div>
        </div>
      </section>

      {/* MAIN ANALYSIS AND HOLDINGS ROW */}
      {loading ? (
        <div className="watchlist-loading-state">
          <RefreshCw className="animate-spin text-emerald-400" size={32} />
          <p>Loading portfolio statistics...</p>
        </div>
      ) : holdings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="watchlist-empty-state"
        >
          <div className="empty-state-icon-box">
            <Sparkles size={44} className="text-emerald-500" />
          </div>
          <h2>Start Virtual Trading</h2>
          <p>
            You haven't bought any stock positions yet. Navigate to the Markets page to discover active equities and place your first buy order!
          </p>
        </motion.div>
      ) : (
        <section className="portfolio-main-grid">
          {/* Pie Chart allocation */}
          <div className="portfolio-analytics-col">
            <PortfolioAnalytics holdings={enrichedHoldings} cash={summary.cash} />
          </div>

          {/* Holdings Grid table */}
          <div className="portfolio-table-col">
            <section className="portfolio-holdings-card">
              <div className="portfolio-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ display: "flex", gap: "24px" }}>
                  <button
                    onClick={() => setActivePortfolioTab("holdings")}
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      background: "none",
                      border: "none",
                      borderBottom: activePortfolioTab === "holdings" ? "3px solid #00b074" : "3px solid transparent",
                      color: activePortfolioTab === "holdings" ? "#0f172a" : "#64748b",
                      paddingBottom: "8px",
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                      transition: "all 0.2s ease"
                    }}
                  >
                    Holdings (Delivery)
                  </button>
                  <button
                    onClick={() => setActivePortfolioTab("positions")}
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      background: "none",
                      border: "none",
                      borderBottom: activePortfolioTab === "positions" ? "3px solid #00b074" : "3px solid transparent",
                      color: activePortfolioTab === "positions" ? "#0f172a" : "#64748b",
                      paddingBottom: "8px",
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                      transition: "all 0.2s ease"
                    }}
                  >
                    Positions (Intraday)
                  </button>
                </div>
              </div>

              {isMobile ? (
                renderMobileHoldingsList()
              ) : (
                <div className="portfolio-holdings-table-wrap">
                  <table className="portfolio-holdings-table">
                    <thead>
                      <tr>
                        <th>Stock</th>
                        <th className="num">Qty</th>
                        <th className="num">Avg. Price</th>
                        <th className="num">Current Price</th>
                        <th className="num">Current Value</th>
                        <th className="num">Total P/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="wait">
                        {activeList.length === 0 ? (
                          <tr key="empty-row">
                            <td colSpan="6" style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                <Briefcase size={28} style={{ color: "#cbd5e1" }} />
                                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                                  No active {activePortfolioTab === "holdings" ? "holdings (Delivery)" : "positions (Intraday)"}
                                </span>
                                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                                  Go to Markets to place an order.
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          activeList.map((r) => {
                            const isCardPos = r.totalPnL >= 0;
                            return (
                              <motion.tr
                                layout
                                key={`${r.symbol}-${r.productType}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => navigate(`/stocks/${r.symbol.toUpperCase()}`)}
                                className="clickable-row"
                              >
                                <td>
                                  <div className="holdings-stock" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <StockLogo symbol={r.symbol} size={32} />
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                      <span className="holdings-symbol">{r.symbol}</span>
                                      <span className="holdings-name">{r.productType === "INTRADAY" ? "Intraday (MIS)" : "Delivery (CNC)"}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="num">
                                  {r.quantity < 0 ? (
                                    <span style={{
                                      color: "#ef4444",
                                      background: "rgba(239, 68, 68, 0.1)",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      marginRight: "6px",
                                      display: "inline-block"
                                    }}>
                                      SHORT
                                    </span>
                                  ) : null}
                                  {Math.abs(r.quantity)}
                                </td>
                                <td className="num">{formatINR(r.avgPrice)}</td>
                                <td className="num">{formatINR(r.ltp)}</td>
                                <td className="num">{formatINR(r.currentVal)}</td>
                                <td className={`num ${isCardPos ? "positive" : "negative"}`}>
                                  {isCardPos ? "+" : ""}{formatINR(r.totalPnL)} ({r.totalPnLPct.toFixed(2)}%)
                                </td>
                              </motion.tr>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </section>
      )}
    </div>
  );
};

export default Portfolio;
