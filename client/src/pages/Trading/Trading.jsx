import { useState, useEffect, useMemo, useRef } from "react";
import { useMarket } from "../../context/MarketContext";
import { socket } from "../../services/socket";
import { getWatchlist } from "../../services/watchlistService";
import { searchStocks } from "../../services/marketApi";
import { getHoldings } from "../../services/holdingService";
import { getOrders, placeOrder } from "../../services/orderService";
import { getUserProfile } from "../../services/authService";
import TradingChart from "../../components/chart/TradingChart";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Search, Plus, Check, RefreshCw, X, TrendingUp, TrendingDown, 
  ShoppingCart, BarChart2, Briefcase, FileText, Activity, AlertCircle, 
  Layers, Clock, ArrowRight 
} from "lucide-react";

// Helper to format currency
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

// Seed deterministic prices for custom symbols
const getInitialPrice = (symbol) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const basePrice = Math.abs(hash % 2900) + 100;
  const changePercent = ((hash % 100) / 25) - 2;
  const open = basePrice * (1 - changePercent / 100);
  const high = Math.max(basePrice, open) * (1 + 0.012);
  const low = Math.min(basePrice, open) * (1 - 0.012);
  
  return {
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(changePercent.toFixed(2)),
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(open.toFixed(2)),
  };
};

const Trading = () => {
  const { marketStocks } = useMarket();

  // Selected Stock Symbol
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [timeframe, setTimeframe] = useState("1D");

  // Terminal state logs
  const [watchlist, setWatchlist] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Left sidebar search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Quick Order ticket
  const [tradeType, setTradeType] = useState("BUY");
  const [tradeQty, setTradeQty] = useState(5);
  const [tradePrice, setTradePrice] = useState(0);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Bottom tabs state ("positions" or "orders")
  const [bottomTab, setBottomTab] = useState("positions");

  // Dynamic simulated price feeds
  const [simulatedPrices, setSimulatedPrices] = useState({});
  const [liveTicks, setLiveTicks] = useState([]);
  const [cashBalance, setCashBalance] = useState(1000000);

  // Fetch initial watchlist, holdings, and order history
  const fetchTerminalData = async () => {
    try {
      const watchlistData = await getWatchlist();
      setWatchlist(watchlistData.watchlist || []);
      
      const holdingsData = await getHoldings();
      setHoldings(holdingsData.holdings || []);

      const ordersData = await getOrders();
      setOrders(ordersData.orders || []);

      const profile = await getUserProfile();
      setCashBalance(profile.balance !== undefined ? profile.balance : 1000000);
    } catch (error) {
      console.error("Terminal initialization error:", error);
    }
  };

  useEffect(() => {
    fetchTerminalData();
  }, []);

  // Fetch orders and holdings periodically to catch executed simulation trades
  useEffect(() => {
    const dataTimer = setInterval(async () => {
      try {
        const holdingsData = await getHoldings();
        setHoldings(holdingsData.holdings || []);

        const ordersData = await getOrders();
        setOrders(ordersData.orders || []);

        const profile = await getUserProfile();
        setCashBalance(profile.balance !== undefined ? profile.balance : 1000000);
      } catch (err) {
        console.error(err);
      }
    }, 4000);
    return () => clearInterval(dataTimer);
  }, []);

  // Check if active stock is in core socket feed
  const liveStock = useMemo(() => {
    return marketStocks.find(
      (s) => s.symbol.toUpperCase() === selectedSymbol.toUpperCase()
    );
  }, [selectedSymbol, marketStocks]);

  // Derive current stock pricing (ltp, change, open, high, low, etc.)
  const activeStockDetails = useMemo(() => {
    if (liveStock) {
      const price = parseFloat(liveStock.price) || 0;
      return {
        symbol: selectedSymbol.toUpperCase(),
        name: liveStock.company || selectedSymbol.toUpperCase(),
        price,
        change: parseFloat(liveStock.change) || 0,
        open: parseFloat(liveStock.open) || price * 0.98,
        high: parseFloat(liveStock.high) || price * 1.02,
        low: parseFloat(liveStock.low) || price * 0.97,
        close: parseFloat(liveStock.close) || price * 0.98,
        volume: liveStock.volume || "1.2M",
        isLive: true,
      };
    }

    const sim = simulatedPrices[selectedSymbol.toUpperCase()] || getInitialPrice(selectedSymbol);
    return {
      symbol: selectedSymbol.toUpperCase(),
      name: selectedSymbol.toUpperCase() + " Equity",
      price: sim.price,
      change: sim.change,
      open: sim.open,
      high: sim.high,
      low: sim.low,
      close: sim.close,
      volume: "850K",
      isLive: false,
    };
  }, [selectedSymbol, liveStock, simulatedPrices]);

  // Set trade price input when stock details change
  useEffect(() => {
    setTradePrice(activeStockDetails.price);
  }, [activeStockDetails.price]);

  // Dynamic price tick compiler for charting
  useEffect(() => {
    const timeLabel = new Date().toLocaleTimeString("en-IN", { hour12: false }).slice(-8);
    setLiveTicks((prev) => {
      const nextTicks = [...prev, { time: timeLabel, price: activeStockDetails.price }];
      // Limit to last 15 ticks
      return nextTicks.slice(-15);
    });
  }, [activeStockDetails.price]);

  // Clear ticks on switching stock
  useEffect(() => {
    setLiveTicks([]);
  }, [selectedSymbol]);

  // Register dynamic view-stock in backend dynamically
  useEffect(() => {
    if (selectedSymbol) {
      socket.emit("view-stock", selectedSymbol);
    }
    return () => {
      socket.emit("unview-stock");
    };
  }, [selectedSymbol]);

  // Simulate ticks for custom symbols not in core feed
  useEffect(() => {
    const timer = setInterval(() => {
      const isCore = marketStocks.some(
        (s) => s.symbol.toUpperCase() === selectedSymbol.toUpperCase()
      );

      if (!isCore) {
        setSimulatedPrices((prev) => {
          const sym = selectedSymbol.toUpperCase();
          const current = prev[sym] || getInitialPrice(sym);
          const delta = (Math.random() * 0.24 - 0.12) / 100; // ±0.12%
          const newPrice = current.price * (1 + delta);
          
          const newHigh = Math.max(current.high, newPrice);
          const newLow = Math.min(current.low, newPrice);
          
          const initial = getInitialPrice(sym);
          const newChange = ((newPrice - initial.close) / initial.close) * 100;

          return {
            ...prev,
            [sym]: {
              ...current,
              price: parseFloat(newPrice.toFixed(2)),
              change: parseFloat(newChange.toFixed(2)),
              high: parseFloat(newHigh.toFixed(2)),
              low: parseFloat(newLow.toFixed(2)),
            }
          };
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [selectedSymbol, marketStocks]);

  // Left sidebar search handler
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
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  // Watchlist Selector rows
  const watchlistStocks = useMemo(() => {
    return watchlist.map((item) => {
      const live = marketStocks.find(
        (s) => s.symbol.toUpperCase() === item.symbol.toUpperCase()
      );
      if (live) {
        return { symbol: item.symbol, price: parseFloat(live.price), change: parseFloat(live.change) };
      }
      const sim = getInitialPrice(item.symbol);
      return { symbol: item.symbol, price: sim.price, change: sim.change };
    });
  }, [watchlist, marketStocks]);

  // Check user holdings position in selected stock
  const activeStockPosition = useMemo(() => {
    return holdings.find(
      (h) => h.symbol.toUpperCase() === selectedSymbol.toUpperCase()
    );
  }, [holdings, selectedSymbol]);

  // Calculate dynamic cash balance based on actual holdings (Total Rs 10 Lakhs simulation limit)
  const portfolioSummary = useMemo(() => {
    const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avgPrice, 0);
    return { invested: totalInvested, cash: cashBalance };
  }, [holdings, cashBalance]);

  // Submit Order Execution
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (tradeQty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const cost = tradeQty * tradePrice;
    if (tradeType === "BUY" && cost > portfolioSummary.cash) {
      toast.error("Insufficient virtual cash margin available");
      return;
    }

    if (tradeType === "SELL" && (!activeStockPosition || activeStockPosition.quantity < tradeQty)) {
      toast.error(`Insufficient stock holdings. You only hold ${activeStockPosition?.quantity || 0} shares.`);
      return;
    }

    try {
      setSubmittingOrder(true);
      await placeOrder({
        symbol: selectedSymbol.toUpperCase(),
        type: tradeType,
        quantity: Number(tradeQty),
        price: Number(tradePrice),
      });

      toast.success(
        `Order Placed: ${tradeType} ${tradeQty} shares of ${selectedSymbol}!`
      );
      
      // Refresh order book and positions
      setTimeout(async () => {
        const holdingsData = await getHoldings();
        setHoldings(holdingsData.holdings || []);
        
        const ordersData = await getOrders();
        setOrders(ordersData.orders || []);
        
        toast.success(`Simulation Order Executed!`, { icon: "📊" });
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit simulation order");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="trading-terminal-container">
      {/* 3-COLUMN UPPER TERM LAYOUT */}
      <div className="terminal-upper-layout">
        
        {/* COLUMN 1: LEFT SIDEBAR SELECTOR */}
        <aside className="terminal-selector-sidebar">
          <div className="sidebar-search-box">
            <Search className="sidebar-search-icon" size={16} />
            <input
              type="text"
              placeholder="Search stocks to trade..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="sidebar-search-input"
            />
          </div>

          <div className="selector-list-wrapper">
            {searchQuery ? (
              // Search Results list
              <div className="selector-list-section">
                <span className="section-label">Search Results</span>
                {searching ? (
                  <div className="selector-status-loading">
                    <RefreshCw className="animate-spin text-[#37c98b]" size={16} />
                    <span>Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((stock) => (
                    <div
                      key={stock.instrument_key}
                      onClick={() => {
                        setSelectedSymbol(stock.trading_symbol);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className={`selector-list-item ${selectedSymbol.toUpperCase() === stock.trading_symbol.toUpperCase() ? "active" : ""}`}
                    >
                      <div className="item-symbol-block">
                        <span className="item-sym">{stock.trading_symbol}</span>
                        <span className="item-name">{stock.name || "Stock"}</span>
                      </div>
                      <span className="item-exchange">{stock.exchange}</span>
                    </div>
                  ))
                ) : (
                  <div className="selector-status-empty">
                    <span>No results found</span>
                  </div>
                )}
              </div>
            ) : (
              // Active Watchlist items
              <div className="selector-list-section">
                <span className="section-label">My Watchlist Items</span>
                {watchlistStocks.length > 0 ? (
                  watchlistStocks.map((stock, idx) => {
                    const isPos = stock.change >= 0;
                    return (
                      <div
                        key={`${stock.symbol}-${idx}`}
                        onClick={() => setSelectedSymbol(stock.symbol)}
                        className={`selector-list-item ${selectedSymbol.toUpperCase() === stock.symbol.toUpperCase() ? "active" : ""}`}
                      >
                        <div className="item-symbol-block">
                          <span className="item-sym">{stock.symbol}</span>
                          <span className="item-subtitle">NSE Equity</span>
                        </div>
                        <div className="item-price-block">
                          <span className="item-price">₹{stock.price.toFixed(2)}</span>
                          <span className={`item-pct ${isPos ? "text-emerald-500" : "text-rose-500"}`}>
                            {isPos ? "+" : ""}{stock.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="selector-status-empty">
                    <AlertCircle size={16} />
                    <span>Add stocks from Markets to quickly trade here</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* COLUMN 2: CENTER WORKSPACE (CHART & STATS) */}
        <main className="terminal-chart-workspace">
          {/* Workspace Ticker Header */}
          <div className="workspace-ticker-header">
            <div className="ticker-meta-block">
              <h1 className="ticker-symbol-name">{activeStockDetails.symbol}</h1>
              <span className="ticker-full-name">{activeStockDetails.name}</span>
              {!activeStockDetails.isLive && (
                <span className="card-simulated-pill ml-2">Simulated</span>
              )}
            </div>

            <div className="ticker-pricing-block">
              <span className="ticker-ltp">{formatINR(activeStockDetails.price)}</span>
              <span className={`ticker-pct-badge ${activeStockDetails.change >= 0 ? "positive" : "negative"}`}>
                {activeStockDetails.change >= 0 ? "+" : ""}
                {activeStockDetails.change.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Timeframe selector & Visual Area Chart */}
          <div className="workspace-chart-panel">
            <div className="chart-controls-row">
              <span className="chart-panel-title">Interactive Chart Wave</span>
              <div className="chart-timeframe-btn-group">
                {["1D", "1W", "1M", "1Y"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`timeframe-btn ${timeframe === tf ? "active" : ""}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <TradingChart 
              symbol={selectedSymbol} 
              timeframe={timeframe} 
              liveTicks={liveTicks} 
            />
          </div>

          {/* Statistics Grid */}
          <div className="workspace-stats-panel">
            <div className="stat-progress-range-row">
              <div className="range-labels">
                <span>Low: {formatINR(activeStockDetails.low)}</span>
                <span>High: {formatINR(activeStockDetails.high)}</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill"
                  style={{
                    left: `${Math.max(
                      0,
                      Math.min(
                        100,
                        ((activeStockDetails.price - activeStockDetails.low) / (activeStockDetails.high - activeStockDetails.low || 1)) * 100
                      )
                    )}%`
                  }}
                />
              </div>
            </div>

            <div className="ohlc-stats-grid">
              <div className="stat-box">
                <span className="stat-label">Open</span>
                <span className="stat-val">{formatINR(activeStockDetails.open)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">High</span>
                <span className="stat-val">{formatINR(activeStockDetails.high)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Low</span>
                <span className="stat-val">{formatINR(activeStockDetails.low)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Prev. Close</span>
                <span className="stat-val">{formatINR(activeStockDetails.close)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Est. Volume</span>
                <span className="stat-val">{activeStockDetails.volume}</span>
              </div>
            </div>
          </div>
        </main>

        {/* COLUMN 3: RIGHT SIDEBAR ORDER TICKET */}
        <aside className="terminal-order-sidebar">
          {/* Position details widget */}
          <div className="terminal-sidebar-widget">
            <h3 className="widget-title">Position Status</h3>
            {activeStockPosition ? (
              <div className="position-details-box">
                <div className="pos-detail-row">
                  <span className="pos-label">Shares Held</span>
                  <span className="pos-val">{activeStockPosition.quantity}</span>
                </div>
                <div className="pos-detail-row">
                  <span className="pos-label">Avg. Buy Price</span>
                  <span className="pos-val">{formatINR(activeStockPosition.avgPrice)}</span>
                </div>
                <div className="pos-detail-row">
                  <span className="pos-label">Total Value</span>
                  <span className="pos-val">{formatINR(activeStockPosition.quantity * activeStockDetails.price)}</span>
                </div>
                <div className="pos-detail-row border-t pt-2 mt-2">
                  <span className="pos-label">Unrealized P&L</span>
                  <span className={`pos-val font-bold ${activeStockDetails.price >= activeStockPosition.avgPrice ? "text-emerald-500" : "text-rose-500"}`}>
                    {activeStockDetails.price >= activeStockPosition.avgPrice ? "+" : ""}
                    {formatINR((activeStockDetails.price - activeStockPosition.avgPrice) * activeStockPosition.quantity)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="position-empty-box">
                <AlertCircle size={16} className="text-slate-400" />
                <span>You hold no shares of {selectedSymbol}</span>
              </div>
            )}
          </div>

          {/* Ticket form */}
          <div className="terminal-sidebar-widget">
            <h3 className="widget-title">Order Ticket</h3>
            <form onSubmit={handleSubmitOrder} className="terminal-order-form">
              <div className="trade-type-button-group">
                <button
                  type="button"
                  onClick={() => setTradeType("BUY")}
                  className={`type-selector-btn buy ${tradeType === "BUY" ? "active" : ""}`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType("SELL")}
                  className={`type-selector-btn sell ${tradeType === "SELL" ? "active" : ""}`}
                >
                  SELL
                </button>
              </div>

              <div className="form-input-container">
                <label className="form-label">Available Cash (INR)</label>
                <span className="form-cash-value">{formatINR(portfolioSummary.cash)}</span>
              </div>

              <div className="form-input-container">
                <label className="form-label">Shares Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={tradeQty}
                  onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 0))}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-input-container">
                <label className="form-label">Trigger Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  value={tradePrice}
                  onChange={(e) => setTradePrice(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  required
                />
              </div>

              <div className="estimated-cost-card">
                <span className="cost-label">Margin Required</span>
                <span className="cost-value">{formatINR(tradeQty * tradePrice)}</span>
              </div>

              <button
                type="submit"
                disabled={submittingOrder}
                className={`execute-order-btn ${tradeType === "BUY" ? "btn-buy" : "btn-sell"}`}
              >
                {submittingOrder ? (
                  <RefreshCw className="animate-spin mr-2 inline" size={16} />
                ) : tradeType === "BUY" ? (
                  <ShoppingCart className="mr-2 inline" size={16} />
                ) : (
                  <TrendingUp className="mr-2 inline" size={16} />
                )}
                Submit {tradeType} Order
              </button>
            </form>
          </div>
        </aside>

      </div>

      {/* LOWER PANEL: POSITIONS & ORDER BOOK */}
      <div className="terminal-lower-layout">
        <div className="lower-tabs-header">
          <button
            onClick={() => setBottomTab("positions")}
            className={`lower-tab-btn ${bottomTab === "positions" ? "active" : ""}`}
          >
            <Layers size={15} className="mr-1.5 inline" />
            Active Positions
          </button>
          <button
            onClick={() => setBottomTab("orders")}
            className={`lower-tab-btn ${bottomTab === "orders" ? "active" : ""}`}
          >
            <Clock size={15} className="mr-1.5 inline" />
            Order Book
          </button>
        </div>

        <div className="lower-tabs-content">
          <AnimatePresence mode="wait">
            {bottomTab === "positions" ? (
              // Active holdings positions
              <motion.div
                key="positions-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="tab-table-wrapper"
              >
                <table className="tab-data-table">
                  <thead>
                    <tr>
                      <th>Stock Instrument</th>
                      <th className="num">Quantity</th>
                      <th className="num">Avg. Buy Price</th>
                      <th className="num">Current Price</th>
                      <th className="num">Unrealized P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.length > 0 ? (
                      holdings.map((h, index) => {
                        const live = marketStocks.find(
                          (s) => s.symbol.toUpperCase() === h.symbol.toUpperCase()
                        );
                        let ltp = h.avgPrice;
                        if (live) ltp = parseFloat(live.price);
                        else {
                          const sim = simulatedPrices[h.symbol.toUpperCase()] || getInitialPrice(h.symbol);
                          ltp = sim.price;
                        }

                        const pnl = (ltp - h.avgPrice) * h.quantity;
                        const isPos = pnl >= 0;

                        return (
                          <tr key={`${h.symbol}-${index}`} className="clickable-row" onClick={() => setSelectedSymbol(h.symbol)}>
                            <td className="stock-sym-block">
                              <span className="sym-text">{h.symbol}</span>
                              <span className="ex-badge">NSE</span>
                            </td>
                            <td className="num">{h.quantity}</td>
                            <td className="num">{formatINR(h.avgPrice)}</td>
                            <td className="num">{formatINR(ltp)}</td>
                            <td className={`num font-bold ${isPos ? "text-emerald-500" : "text-rose-500"}`}>
                              {isPos ? "+" : ""}{formatINR(pnl)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="table-empty-row">
                          You currently hold no active stock positions in your virtual account.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              // Order Book Logs
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="tab-table-wrapper"
              >
                <table className="tab-data-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Symbol</th>
                      <th>Type</th>
                      <th className="num">Quantity</th>
                      <th className="num">Trigger Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((o) => {
                        const timeStr = new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", second: "2-digit" });
                        const isBuy = o.type === "BUY";
                        
                        return (
                          <tr key={o._id}>
                            <td className="order-time-cell">{timeStr}</td>
                            <td className="stock-sym-block">
                              <span className="sym-text">{o.symbol}</span>
                            </td>
                            <td>
                              <span className={`order-type-badge ${isBuy ? "buy" : "sell"}`}>
                                {o.type}
                              </span>
                            </td>
                            <td className="num">{o.quantity}</td>
                            <td className="num">{formatINR(o.price)}</td>
                            <td>
                              <span className={`order-status-badge ${o.status.toLowerCase()}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="table-empty-row">
                          No order placements recorded for this session.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Trading;