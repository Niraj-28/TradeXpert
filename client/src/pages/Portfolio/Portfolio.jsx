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

const Portfolio = () => {
  const { marketStocks } = useMarket();
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cashBalance, setCashBalance] = useState(1000000);

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

      const investedVal = holding.quantity * holding.avgPrice;
      const currentVal = holding.quantity * ltp;
      const totalPnL = currentVal - investedVal;
      const totalPnLPct = investedVal > 0 ? (totalPnL / investedVal) * 100 : 0;

      // Daily PnL estimate (using change percent relative to price)
      const dayPnL = currentVal * (change / 100);

      return {
        ...holding,
        ltp,
        change,
        investedVal,
        currentVal,
        totalPnL,
        totalPnLPct,
        dayPnL,
      };
    });
  }, [holdings, marketStocks, simulatedPrices]);

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

  return (
    <div className="portfolio-page">
      {/* HERO SECTION */}
      <div className="portfolio-hero">
        <div className="portfolio-hero-left">
          <div className="portfolio-hero-title-row">
            <h1>Virtual Portfolio</h1>
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
              <div className="portfolio-section-header">
                <h2>Active Stock Positions</h2>
                <p>Live values based on latest market ticks</p>
              </div>

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
                    <AnimatePresence>
                      {enrichedHoldings.map((r) => {
                        const isCardPos = r.totalPnL >= 0;
                        return (
                          <motion.tr
                            layout
                            key={r.symbol}
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
                                  <span className="holdings-name">NSE Equity</span>
                                </div>
                              </div>
                            </td>
                            <td className="num">{r.quantity}</td>
                            <td className="num">{formatINR(r.avgPrice)}</td>
                            <td className="num">{formatINR(r.ltp)}</td>
                            <td className="num">{formatINR(r.currentVal)}</td>
                            <td className={`num ${isCardPos ? "positive" : "negative"}`}>
                              {isCardPos ? "+" : ""}{formatINR(r.totalPnL)} ({r.totalPnLPct.toFixed(2)}%)
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      )}
    </div>
  );
};

export default Portfolio;
