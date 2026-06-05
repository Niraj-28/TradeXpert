import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../../services/watchlistService";
import { searchStocks } from "../../services/marketApi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search, Trash2, Plus, ArrowUpRight, ArrowDownRight,
  RefreshCw, Activity, AlertCircle, X, Check
} from "lucide-react";
import StockLogo from "../../components/ui/StockLogo";

// Format currency
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
  const basePrice = Math.abs(hash % 2900) + 100;
  const changePercent = ((hash % 100) / 25) - 2;
  const open = basePrice * (1 - changePercent / 100);

  return {
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(changePercent.toFixed(2)),
    open: parseFloat(open.toFixed(2)),
    close: parseFloat(open.toFixed(2)),
  };
};

const Watchlist = () => {
  const { marketStocks, connected } = useMarket();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Client-side simulated prices for custom stocks
  const [simulatedPrices, setSimulatedPrices] = useState({});

  const fetchWatchlistData = async () => {
    try {
      setLoading(true);
      const data = await getWatchlist();
      setWatchlist(data.watchlist || []);
    } catch (error) {
      console.error("Watchlist fetch error:", error);
      toast.error("Failed to load your watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlistData();
  }, []);

  // Merge database watchlist with live market updates & simulated prices
  const enrichedWatchlist = useMemo(() => {
    return watchlist.map((item) => {
      const liveStock = marketStocks.find(
        (s) => s.symbol.toUpperCase() === item.symbol.toUpperCase()
      );

      if (liveStock) {
        const price = parseFloat(liveStock.price) || 0;
        const change = parseFloat(liveStock.change) || 0;
        return {
          ...item,
          price,
          change,
          isLive: true,
        };
      }

      const sim = simulatedPrices[item.symbol.toUpperCase()] || getInitialPrice(item.symbol);
      return {
        ...item,
        price: sim.price,
        change: sim.change,
        isLive: false,
      };
    });
  }, [watchlist, marketStocks, simulatedPrices]);

  // Simulate price changes on every interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedPrices((prev) => {
        const updated = { ...prev };
        watchlist.forEach((item) => {
          const sym = item.symbol.toUpperCase();
          const isCore = marketStocks.some(
            (s) => s.symbol.toUpperCase() === sym
          );

          if (!isCore) {
            const current = updated[sym] || getInitialPrice(sym);
            const deltaPercent = (Math.random() * 0.24 - 0.12) / 100;
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
  }, [watchlist, marketStocks]);

  // Search stocks dynamically
  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const data = await searchStocks(val);
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  // Add stock to watchlist
  const handleAddStock = async (symbol) => {
    const upperSym = symbol.toUpperCase();
    if (watchlist.some((w) => w.symbol.toUpperCase() === upperSym)) {
      toast.error("Stock is already on your watchlist");
      return;
    }

    try {
      await addToWatchlist(upperSym);
      toast.success(`${upperSym} added to watchlist`);
      fetchWatchlistData();
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add stock");
    }
  };

  // Remove stock from watchlist
  const handleRemoveStock = async (id, symbol) => {
    try {
      await removeFromWatchlist(id);
      toast.success(`${symbol} removed from watchlist`);
      setWatchlist((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error("Failed to remove stock");
    }
  };

  // Mini Sparkline Line Generator for cards
  const generateSparklinePoints = (change) => {
    const steps = 6;
    const points = [];
    const height = 30;
    const width = 100;

    let currentVal = height / 2;
    points.push(`0,${currentVal}`);

    const direction = change >= 0 ? -1 : 1;

    for (let i = 1; i <= steps; i++) {
      const x = (width / steps) * i;
      const noise = (Math.random() * 8 - 4);
      const trend = direction * (Math.abs(change) * 2) * (i / steps);
      const y = Math.min(Math.max(height / 2 + trend + noise, 3), height - 3);
      points.push(`${x},${y}`);
    }

    return points.join(" ");
  };

  return (
    <div className="watchlist-layout-container">
      <div className="watchlist-main-content" style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>

        {/* HEADER */}
        <div className="watchlist-header-panel">
          <div>
            <h1 className="watchlist-title">My Watchlist</h1>
            <p className="watchlist-subtitle">
              Monitor and trade your favorite financial instruments
            </p>
          </div>

        </div>

        {/* SEARCH BAR CONTAINER */}
        <div className="watchlist-search-container">
          <div className="watchlist-search-wrapper">
            <Search className="search-icon-inside" size={20} />
            <input
              type="text"
              placeholder="Search & add stocks (e.g. RELIANCE, TATASTEEL, INFY)..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="watchlist-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                className="clear-search-btn"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="watchlist-search-dropdown"
              >
                {searching ? (
                  <div className="dropdown-loading">
                    <RefreshCw className="animate-spin text-emerald-500" size={20} />
                    <span>Searching markets...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((stock) => {
                    const isAdded = watchlist.some(
                      (w) => w.symbol.toUpperCase() === stock.trading_symbol.toUpperCase()
                    );
                    return (
                      <div key={stock.instrument_key} className="search-result-item">
                        <div
                          className="result-left"
                          onClick={() => navigate(`/stocks/${stock.trading_symbol.toUpperCase()}`)}
                          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          <StockLogo symbol={stock.trading_symbol} size={28} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span className="result-symbol">{stock.trading_symbol}</span>
                              <span className="result-exchange-badge">{stock.exchange}</span>
                            </div>
                            <span className="result-name" style={{ fontSize: "11px", color: "#64748b", marginTop: "1px" }}>
                              {stock.name || "Equity Stock"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddStock(stock.trading_symbol)}
                          disabled={isAdded}
                          className={`add-watchlist-btn ${isAdded ? "added" : ""}`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} /> Added
                            </>
                          ) : (
                            <>
                              <Plus size={14} /> Add
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="dropdown-empty">
                    <AlertCircle size={20} />
                    <span>No instruments found matching "{searchQuery}"</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* WATCHLIST GRID */}
        {loading ? (
          <div className="watchlist-loading-state">
            <RefreshCw className="animate-spin text-emerald-400" size={32} />
            <p>Loading your watchlist...</p>
          </div>
        ) : enrichedWatchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="watchlist-empty-state"
          >
            <div className="empty-state-icon-box">
              <Activity size={48} className="text-emerald-500" />
            </div>
            <h2>Your Watchlist is Empty</h2>
            <p>
              Use the search bar above to discover stock instruments and add them to your watchlist.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="watchlist-cards-grid"
          >
            <AnimatePresence mode="popLayout">
              {enrichedWatchlist.map((stock) => {
                const isPositive = stock.change >= 0;

                return (
                  <motion.div
                    layout
                    key={stock._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => navigate(`/stocks/${stock.symbol.toUpperCase()}`)}
                    className={`watchlist-stock-card ${isPositive ? "card-pos" : "card-neg"}`}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Top Row */}
                    <div className="card-top-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div className="symbol-exchange-container" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <StockLogo symbol={stock.symbol} size={32} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className="card-symbol">{stock.symbol}</span>
                            <span className="card-exchange-pill">NSE</span>
                          </div>
                          {!stock.isLive && (
                            <span className="card-simulated-pill" style={{ alignSelf: "flex-start", marginTop: "2px" }}>Sim</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStock(stock._id, stock.symbol);
                        }}
                        className="card-remove-btn"
                        title="Remove from watchlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Sparkline Row */}
                    <div className="card-sparkline-row">
                      <svg className="sparkline-svg" width="100" height="30">
                        <polyline
                          fill="none"
                          stroke={isPositive ? "#00b074" : "#ff4d4d"}
                          strokeWidth="2.2"
                          points={generateSparklinePoints(stock.change)}
                        />
                      </svg>
                    </div>

                    {/* Bottom Row */}
                    <div className="card-bottom-row">
                      <div className="card-price-value">
                        {formatINR(stock.price)}
                      </div>
                      <div className={`card-change-badge ${isPositive ? "positive" : "negative"}`}>
                        {isPositive ? (
                          <ArrowUpRight size={14} className="inline mr-0.5" />
                        ) : (
                          <ArrowDownRight size={14} className="inline mr-0.5" />
                        )}
                        {Math.abs(stock.change).toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;