import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { getHoldings } from "../../services/holdingService";
import { placeOrder } from "../../services/orderService";
import { getUserProfile } from "../../services/authService";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, BarChart, Bar 
} from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, 
  Check, Plus, RefreshCw, AlertCircle, Settings, ChevronDown, Bell, Star,
  TrendingUp as BuyIcon, ShieldAlert, Award, Globe, Calendar, FileText
} from "lucide-react";
import toast from "react-hot-toast";

// Format currency
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

// Deterministic mock data seed for custom stocks
const getInitialStockStats = (symbol) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const basePrice = Math.abs(hash % 2900) + 100;
  const changePercent = ((hash % 100) / 25) - 2; // -2% to +2%
  const changeVal = basePrice * (changePercent / 100);
  const open = basePrice - changeVal;
  const high = Math.max(basePrice, open) * (1 + 0.012);
  const low = Math.min(basePrice, open) * (1 - 0.012);
  
  const yLow = low * 0.92;
  const yHigh = high * 1.15;

  return {
    symbol: symbol.toUpperCase(),
    companyName: symbol.toUpperCase() + " Technologies India",
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(changePercent.toFixed(2)),
    changeAmt: parseFloat(changeVal.toFixed(2)),
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    prevClose: parseFloat(open.toFixed(2)),
    volume: "1.2M",
    w52Low: parseFloat(yLow.toFixed(2)),
    w52High: parseFloat(yHigh.toFixed(2)),
    isLive: false,
  };
};

// Dynamic indicators/details for stock page tabs
const getStockTabDetails = (symbol, price) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Sentiment (e.g. Bullish, Bearish, Neutral)
  const sentimentIndex = Math.abs(hash % 3); // 0 = Bearish, 1 = Neutral, 2 = Bullish
  const sentiments = ["Bearish", "Neutral", "Bullish"];
  const sentiment = sentiments[sentimentIndex];
  
  // EMA/SMA indicators
  const ema20 = price * 0.992;
  const sma50 = price * 0.985;
  const sma100 = price * 0.97;
  const sma200 = price * 0.94;

  const rsi = parseFloat((35 + (hash % 45)).toFixed(1)); // RSI 35 to 80
  const rsiStatus = rsi > 70 ? "Overbought (Sell)" : rsi < 30 ? "Oversold (Buy)" : "Neutral";

  // News headlines
  const news = [
    {
      title: `${symbol} Q4 Profits Surge by ${Math.abs(hash % 20) + 12}% Outperforming Market Projections`,
      source: "Moneycontrol",
      time: "2 hours ago",
      summary: `${symbol} reported a stellar performance in the fourth quarter with significant growth in key business verticals and operational margins.`
    },
    {
      title: `Top Broking Firms Maintain 'BUY' Rating on ${symbol} with Revised Target Price`,
      source: "Economic Times",
      time: "5 hours ago",
      summary: `Leading financial institutions have upgraded the target price for ${symbol} citing strong execution pipeline and virtual cash reserves.`
    },
    {
      title: `Market Live: ${symbol} Share Price Rallies to Touch Daily High`,
      source: "Bloomberg Quint",
      time: "1 day ago",
      summary: `${symbol} shares opened higher today tracking positive global cues and increased retail investor interest.`
    },
    {
      title: `How ${symbol} is Positioned to Lead the Next Wave of Sector Growth`,
      source: "ET NOW",
      time: "2 days ago",
      summary: "An in-depth corporate analysis of the company's long-term business roadmap, balance sheet, and execution history."
    }
  ];

  // Events
  const events = [
    { type: "Board Meeting", date: "June 12, 2026", purpose: "Audited Financial Results & dividend consideration" },
    { type: "Dividend Paid", date: "May 20, 2026", purpose: "Final Dividend of ₹" + ((Math.abs(hash) % 15) + 5) + ".50 per equity share" },
    { type: "Corporate Action", date: "April 08, 2026", purpose: "1:1 Bonus Shares Issue Approval" },
    { type: "AGM Scheduled", date: "August 24, 2026", purpose: "Annual General Meeting to approve auditor appointments" }
  ];

  return {
    sentiment,
    ema20,
    sma50,
    sma100,
    sma200,
    rsi,
    rsiStatus,
    news,
    events
  };
};

// Custom shape component for drawing candlesticks in Recharts
const CandleShape = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload || !payload.open || !payload.close) return null;
  const { open, close, high, low } = payload;
  const isPositive = close >= open;
  const color = isPositive ? "#00b074" : "#ff4d4d";
  
  const valueDiff = Math.abs(close - open) || 0.1;
  const pixelPerValue = height / valueDiff;
  
  const maxVal = Math.max(open, close);
  const minVal = Math.min(open, close);
  
  // Calculate relative wicks
  const lowY = y + (maxVal - low) * pixelPerValue;
  const highY = y - (high - maxVal) * pixelPerValue;
  
  const candleWidth = Math.min(width, 14);
  const candleX = x + (width - candleWidth) / 2;
  const centerX = x + width / 2;
  
  return (
    <g>
      {/* Wick line */}
      <line 
        x1={centerX} 
        y1={highY} 
        x2={centerX} 
        y2={lowY} 
        stroke={color} 
        strokeWidth={1.5} 
      />
      {/* Body rect */}
      <rect 
        x={candleX} 
        y={y} 
        width={candleWidth} 
        height={height} 
        fill={color} 
        stroke={color}
        strokeWidth={1}
        rx={1}
      />
    </g>
  );
};

// Seed deterministic historical data (Line and Candle options)
const generateHistoricalPoints = (symbol, timeframe, isCandle) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const basePrice = Math.abs(hash % 2900) + 100;
  
  let pointsCount = 30;
  let intervalDays = 1;

  if (timeframe === "1W") {
    pointsCount = 7;
  } else if (timeframe === "1M") {
    pointsCount = 30;
  } else if (timeframe === "3M") {
    pointsCount = 45;
    intervalDays = 2;
  } else if (timeframe === "1Y") {
    pointsCount = 12;
    intervalDays = 30;
  } else if (timeframe === "ALL") {
    pointsCount = 20;
    intervalDays = 60;
  }

  const data = [];
  let currentClose = basePrice * 0.92;
  const now = new Date();

  for (let i = pointsCount - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * intervalDays * 24 * 60 * 60 * 1000);
    
    // Deterministic random walk
    const seed = Math.sin(hash + i) * 1.8;
    const trend = (i / pointsCount) * (hash % 12 - 6);
    const pct = (seed + trend) / 100;
    
    const open = currentClose;
    currentClose = currentClose * (1 + pct);
    const close = currentClose;
    
    const high = Math.max(open, close) * (1 + Math.abs(Math.cos(hash * i) * 0.015));
    const low = Math.min(open, close) * (1 - Math.abs(Math.sin(hash * i) * 0.015));

    let label = "";
    if (timeframe === "1W") {
      label = date.toLocaleDateString("en-IN", { weekday: "short" });
    } else if (timeframe === "1M" || timeframe === "3M") {
      label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } else {
      label = date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    }

    if (isCandle) {
      data.push({
        time: label,
        open: parseFloat(open.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        range: [parseFloat(Math.min(open, close).toFixed(2)), parseFloat(Math.max(open, close).toFixed(2))]
      });
    } else {
      data.push({
        time: label,
        price: parseFloat(close.toFixed(2)),
      });
    }
  }

  return data;
};

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { marketStocks } = useMarket();

  // Navigation query parameter (Buy vs Sell)
  const initialType = searchParams.get("type") === "SELL" ? "SELL" : "BUY";

  // Tab selections
  const [chartType, setChartType] = useState("line"); // "line" | "candle"
  const [timeframe, setTimeframe] = useState("1D");
  const [activeTab, setActiveTab] = useState("Overview"); // Overview, Technicals, News, Events

  // Order Ticket states
  const [tradeType, setTradeType] = useState(initialType);
  const [productType, setProductType] = useState("Delivery"); // Delivery | Intraday
  const [priceMode, setPriceMode] = useState("Market"); // Market | Limit
  const [tradeQty, setTradeQty] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Simulated cash and holdings
  const [holdings, setHoldings] = useState([]);
  const [cashBalance, setCashBalance] = useState(1000000);
  const [liveTicks, setLiveTicks] = useState([]);
  const [simulatedPrice, setSimulatedPrice] = useState(null);

  // Fetch initial cash and user position state
  const fetchUserData = async () => {
    try {
      const data = await getHoldings();
      const currentHoldings = data.holdings || [];
      setHoldings(currentHoldings);
      
      const profile = await getUserProfile();
      setCashBalance(profile.balance !== undefined ? profile.balance : 1000000);
    } catch (error) {
      console.error("Failed to load user portfolio data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Find stock in live feed
  const liveStock = useMemo(() => {
    return marketStocks.find(
      (s) => s.symbol.toUpperCase() === symbol.toUpperCase()
    );
  }, [symbol, marketStocks]);

  // Compile active details (live vs simulated)
  const stockDetails = useMemo(() => {
    if (liveStock) {
      const price = parseFloat(liveStock.price) || 0;
      const change = parseFloat(liveStock.change) || 0;
      const changeAmt = price * (change / 100);
      const open = parseFloat(liveStock.open) || price - changeAmt;
      const high = parseFloat(liveStock.high) || Math.max(price, open) * 1.01;
      const low = parseFloat(liveStock.low) || Math.min(price, open) * 0.99;
      
      const seedStats = getInitialStockStats(symbol);

      return {
        symbol: symbol.toUpperCase(),
        companyName: liveStock.company || symbol.toUpperCase() + " Equity",
        price,
        change,
        changeAmt,
        open,
        high,
        low,
        prevClose: parseFloat(liveStock.close) || open,
        volume: liveStock.volume || "1.5M",
        w52Low: seedStats.w52Low,
        w52High: seedStats.w52High,
        isLive: true,
      };
    }

    // Return simulation
    const seedStats = getInitialStockStats(symbol);
    const activeSimPrice = simulatedPrice || seedStats.price;
    const initialPrice = seedStats.price;
    const currentChangeAmt = activeSimPrice - seedStats.prevClose;
    const currentChangePct = (currentChangeAmt / seedStats.prevClose) * 100;

    return {
      ...seedStats,
      price: activeSimPrice,
      change: currentChangePct,
      changeAmt: currentChangeAmt,
      high: Math.max(seedStats.high, activeSimPrice),
      low: Math.min(seedStats.low, activeSimPrice),
    };
  }, [symbol, liveStock, simulatedPrice]);

  // Tab details content (Technicals, News, Events)
  const tabDetails = useMemo(() => {
    return getStockTabDetails(symbol, stockDetails.price);
  }, [symbol, stockDetails.price]);

  // Set default limit price when price changes
  useEffect(() => {
    if (priceMode === "Limit" && limitPrice === 0) {
      setLimitPrice(stockDetails.price);
    }
  }, [stockDetails.price, priceMode]);

  // Simulate dynamic ticks for non-feed stocks
  useEffect(() => {
    if (!liveStock) {
      const timer = setInterval(() => {
        setSimulatedPrice((prev) => {
          const base = prev || getInitialStockStats(symbol).price;
          const fluctuation = (Math.random() * 0.28 - 0.14) / 100; // ±0.14%
          return parseFloat((base * (1 + fluctuation)).toFixed(2));
        });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [symbol, liveStock]);

  // Generate live ticks for 1D chart view
  useEffect(() => {
    const timeLabel = new Date().toLocaleTimeString("en-IN", { hour12: false }).slice(-8);
    setLiveTicks((prev) => {
      const ticks = [...prev, { time: timeLabel, price: stockDetails.price }];
      return ticks.slice(-20);
    });
  }, [stockDetails.price]);

  // Clear ticks on symbol switch
  useEffect(() => {
    setLiveTicks([]);
  }, [symbol]);

  // Dynamic Chart Points compiler
  const chartData = useMemo(() => {
    const isCandle = chartType === "candle";
    if (timeframe === "1D") {
      if (isCandle) {
        // Compile mock candles for 1D view
        const base = stockDetails.price;
        return Array.from({ length: 15 }, (_, i) => {
          const factor = Math.sin(i * 0.6) * 12;
          const open = base + factor;
          const close = base + factor + (Math.cos(i) * 8);
          const high = Math.max(open, close) + 5;
          const low = Math.min(open, close) - 4;
          return {
            time: `${10 + Math.floor(i/2)}:${(i%2) * 30 || "00"}`,
            open,
            close,
            high,
            low,
            range: [Math.min(open, close), Math.max(open, close)],
          };
        });
      }
      // Line chart 1D returns live ticks or seeded path
      if (liveTicks.length > 1) {
        return liveTicks;
      }
      return Array.from({ length: 12 }, (_, i) => {
        const factor = Math.sin(i * 0.5) * 0.008;
        return {
          time: `${9 + Math.floor(i/2)}:${(i%2)*30 || "00"}`,
          price: parseFloat((stockDetails.open * (1 + factor)).toFixed(2)),
        };
      });
    }

    return generateHistoricalPoints(symbol, timeframe, isCandle);
  }, [symbol, timeframe, chartType, stockDetails, liveTicks]);

  // Check if user holds active stock
  const userPosition = useMemo(() => {
    return holdings.find(h => h.symbol.toUpperCase() === symbol.toUpperCase());
  }, [holdings, symbol]);

  // Calculate dynamic bid-ask lists for depth (fluctuates around LTP)
  const marketDepthData = useMemo(() => {
    const ltp = stockDetails.price;
    const bidOrders = [];
    const askOrders = [];
    
    let bidSum = 0;
    let askSum = 0;

    for (let i = 0; i < 5; i++) {
      const step = (i + 1) * 0.25;
      const bidPrice = ltp - step;
      const askPrice = ltp + step;
      
      const bidQty = Math.floor(Math.sin(ltp + i) * 120) + 180;
      const askQty = Math.floor(Math.cos(ltp - i) * 140) + 190;
      
      bidOrders.push({ price: parseFloat(bidPrice.toFixed(2)), qty: bidQty });
      askOrders.push({ price: parseFloat(askPrice.toFixed(2)), qty: askQty });

      bidSum += bidQty;
      askSum += askQty;
    }

    const totalOrders = bidSum + askSum;
    const buyPct = totalOrders > 0 ? (bidSum / totalOrders) * 100 : 50;
    const sellPct = 100 - buyPct;

    return {
      bids: bidOrders,
      asks: askOrders,
      bidTotal: bidSum,
      askTotal: askSum,
      buyPct: parseFloat(buyPct.toFixed(2)),
      sellPct: parseFloat(sellPct.toFixed(2)),
    };
  }, [stockDetails.price]);

  // Trigger Trade Execution
  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    if (tradeQty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const execPrice = priceMode === "Market" ? stockDetails.price : limitPrice;
    const cost = tradeQty * execPrice;

    if (tradeType === "BUY" && cost > cashBalance) {
      toast.error("Insufficient virtual cash balance available!");
      return;
    }

    if (tradeType === "SELL" && (!userPosition || userPosition.quantity < tradeQty)) {
      toast.error(`Insufficient position holdings! You only own ${userPosition?.quantity || 0} shares.`);
      return;
    }

    try {
      setPlacingOrder(true);
      await placeOrder({
        symbol: symbol.toUpperCase(),
        type: tradeType,
        quantity: Number(tradeQty),
        price: Number(execPrice),
      });

      toast.success(`Virtual order submitted: ${tradeType} ${tradeQty} shares of ${symbol.toUpperCase()}`);
      
      // Auto execute simulation delay
      setTimeout(() => {
        toast.success(`Order Filled: Executed ${tradeQty} shares at ₹${execPrice.toFixed(2)}`, { icon: "📈" });
        fetchUserData();
      }, 2000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Virtual execution failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  const isPositive = stockDetails.change >= 0;
  const totalCost = tradeQty * (priceMode === "Market" ? stockDetails.price : limitPrice);

  return (
    <div className="stock-details-page-container">
      {/* 2-COLUMN VIEWPORT */}
      <div className="stock-details-grid-wrapper">
        
        {/* LEFT COMPONENT COLUMN */}
        <div className="stock-info-main-column">
          
          {/* Header block */}
          <div className="stock-profile-header-card">
            <div className="profile-logo-avatar">
              {symbol.slice(0, 2).toUpperCase()}
            </div>
            
            <div className="profile-text-block">
              <div className="profile-exchange-row">
                <span className="stock-tag">{symbol.toUpperCase()}</span>
                <span className="exchange-dot">•</span>
                <span className="exchange-label">NSE</span>
              </div>
              <h1 className="company-fullname">{stockDetails.companyName}</h1>
              
              <div className="price-quote-block">
                <span className="price-val">{formatINR(stockDetails.price)}</span>
                <span className={`change-badge ${isPositive ? "up" : "down"}`}>
                  {isPositive ? "+" : ""}
                  {stockDetails.changeAmt.toFixed(2)} ({isPositive ? "+" : ""}
                  {stockDetails.change.toFixed(2)}%)
                </span>
                <span className="timeframe-indicator">1D</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Visualizer */}
          <div className="stock-chart-panel-card">
            <div className="chart-header-row">
              <div className="chart-title-box">
                <span className="chart-label">Interactive Price Chart</span>
                <span className={`chart-indicator-dot ${stockDetails.isLive ? "live" : "simulated"}`}></span>
              </div>

              {/* Line vs Candlestick Toggle */}
              <div className="chart-type-toggle-group">
                <button
                  onClick={() => setChartType("line")}
                  className={`type-btn ${chartType === "line" ? "active" : ""}`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType("candle")}
                  className={`type-btn ${chartType === "candle" ? "active" : ""}`}
                >
                  Candlestick
                </button>
              </div>
            </div>

            {/* Recharts Wrapper */}
            <div className="recharts-wrapper-box">
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "line" ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isPositive ? "#00b074" : "#ff4d4d"} stopOpacity={0.16} />
                        <stop offset="95%" stopColor={isPositive ? "#00b074" : "#ff4d4d"} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis 
                      domain={["auto", "auto"]} 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      orientation="right" 
                      formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                    />
                    <Tooltip 
                      formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "LTP"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e8edf5",
                        boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
                        fontSize: "12px",
                        fontFamily: "Poppins, sans-serif"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={isPositive ? "#00b074" : "#ff4d4d"} 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#glowColor)" 
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis 
                      domain={["auto", "auto"]} 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      orientation="right"
                      formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                    />
                    <Tooltip 
                      formatter={(v, name, props) => {
                        const { open, close, high, low } = props.payload;
                        return [
                          `Open: ₹${open} | Close: ₹${close} | High: ₹${high} | Low: ₹${low}`,
                          "Candle"
                        ];
                      }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e8edf5",
                        boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
                        fontSize: "11px",
                        fontFamily: "Poppins, sans-serif"
                      }}
                    />
                    <Bar 
                      dataKey="range" 
                      shape={<CandleShape />} 
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Timeframes Bar */}
            <div className="chart-timeframe-selectors-bar">
              {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`tf-selector-btn ${timeframe === tf ? "active" : ""}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Details & Metrics Tabs Panel */}
          <div className="details-metrics-tabs-container">
            <div className="tabs-header-menu">
              {["Overview", "Technicals", "News", "Events"].map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setActiveTab(tabName)}
                  className={`menu-tab-btn ${activeTab === tabName ? "active" : ""}`}
                >
                  {tabName}
                </button>
              ))}
            </div>

            <div className="tabs-content-viewport">
              {activeTab === "Overview" && (
                <div className="overview-tab-content">
                  
                  {/* MARKET DEPTH WIDGET */}
                  <div className="overview-depth-panel">
                    <h3 className="overview-section-title">Market Depth</h3>
                    
                    {/* Ratio Indicator Bar */}
                    <div className="depth-ratio-wrapper">
                      <div className="ratio-labels">
                        <span className="buy-pct text-[#00b074]">Buy Orders ({marketDepthData.buyPct}%)</span>
                        <span className="sell-pct text-[#ff4d4d]">Sell Orders ({marketDepthData.sellPct}%)</span>
                      </div>
                      
                      <div className="ratio-bar-progress">
                        <div 
                          className="bar-fill-buy" 
                          style={{ width: `${marketDepthData.buyPct}%` }}
                        />
                        <div 
                          className="bar-fill-sell" 
                          style={{ width: `${marketDepthData.sellPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Depth grid list comparison */}
                    <div className="depth-offers-comparison-grid">
                      {/* Bids Column */}
                      <div className="depth-col-bids">
                        <div className="depth-header-row">
                          <span>Bid Price (₹)</span>
                          <span className="qty">Qty</span>
                        </div>
                        {marketDepthData.bids.map((b, idx) => (
                          <div key={`bid-${idx}`} className="depth-value-row">
                            <span className="price text-[#00b074]">{b.price.toFixed(2)}</span>
                            <span className="qty">{b.qty}</span>
                          </div>
                        ))}
                        <div className="depth-footer-row border-t pt-2 mt-1">
                          <span className="total-label">Total Bid Volume</span>
                          <span className="total-val">{marketDepthData.bidTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Asks Column */}
                      <div className="depth-col-asks">
                        <div className="depth-header-row">
                          <span>Ask Price (₹)</span>
                          <span className="qty">Qty</span>
                        </div>
                        {marketDepthData.asks.map((a, idx) => (
                          <div key={`ask-${idx}`} className="depth-value-row">
                            <span className="price text-[#ff4d4d]">{a.price.toFixed(2)}</span>
                            <span className="qty">{a.qty}</span>
                          </div>
                        ))}
                        <div className="depth-footer-row border-t pt-2 mt-1">
                          <span className="total-label">Total Ask Volume</span>
                          <span className="total-val">{marketDepthData.askTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PERFORMANCE OVERVIEWS */}
                  <div className="overview-performance-panel">
                    <h3 className="overview-section-title">Performance</h3>

                    {/* Today's low/high range */}
                    <div className="performance-range-slider-row">
                      <div className="extreme-labels">
                        <div className="label-block text-left">
                          <span>Today's Low</span>
                          <strong>{formatINR(stockDetails.low)}</strong>
                        </div>
                        <div className="label-block text-right">
                          <span>Today's High</span>
                          <strong>{formatINR(stockDetails.high)}</strong>
                        </div>
                      </div>

                      <div className="range-track-bar">
                        <div 
                          className="range-tick-indicator" 
                          style={{
                            left: `${Math.max(0, Math.min(100, ((stockDetails.price - stockDetails.low) / (stockDetails.high - stockDetails.low || 1)) * 100))}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* 52w low/high range */}
                    <div className="performance-range-slider-row mt-6">
                      <div className="extreme-labels">
                        <div className="label-block text-left">
                          <span>52-Week Low</span>
                          <strong>{formatINR(stockDetails.w52Low)}</strong>
                        </div>
                        <div className="label-block text-right">
                          <span>52-Week High</span>
                          <strong>{formatINR(stockDetails.w52High)}</strong>
                        </div>
                      </div>

                      <div className="range-track-bar">
                        <div 
                          className="range-tick-indicator" 
                          style={{
                            left: `${Math.max(0, Math.min(100, ((stockDetails.price - stockDetails.w52Low) / (stockDetails.w52High - stockDetails.w52Low || 1)) * 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TECHNICALS TAB */}
              {activeTab === "Technicals" && (
                <div className="technicals-tab-viewport">
                  <div className="tech-summary-header mb-6">
                    <span className="summary-label text-slate-400 text-xs font-semibold block mb-1">MARKET SENTIMENT</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold ${
                        tabDetails.sentiment === "Bullish" ? "text-[#00b074]" : 
                        tabDetails.sentiment === "Bearish" ? "text-[#ff4d4d]" : "text-amber-500"
                      }`}>
                        {tabDetails.sentiment}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md font-semibold">EMA / SMA Sync</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Moving Averages */}
                    <div className="tech-section-block">
                      <h4 className="text-sm font-bold text-slate-700 mb-3 border-b pb-2">Moving Averages</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">EMA (20)</span>
                          <span className="font-bold text-[#0f172a]">{formatINR(tabDetails.ema20)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">SMA (50)</span>
                          <span className="font-bold text-[#0f172a]">{formatINR(tabDetails.sma50)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">SMA (100)</span>
                          <span className="font-bold text-[#0f172a]">{formatINR(tabDetails.sma100)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">SMA (200)</span>
                          <span className="font-bold text-[#0f172a]">{formatINR(tabDetails.sma200)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Oscillators */}
                    <div className="tech-section-block">
                      <h4 className="text-sm font-bold text-slate-700 mb-3 border-b pb-2">Oscillators</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">RSI (14)</span>
                          <div className="text-right">
                            <span className="font-bold text-[#0f172a] block">{tabDetails.rsi}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{tabDetails.rsiStatus}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs border-t pt-2">
                          <span className="text-slate-500 font-medium">MACD (12, 26)</span>
                          <span className="font-bold text-[#00b074]">Buy Signal</span>
                        </div>
                        <div className="flex justify-between text-xs border-t pt-2">
                          <span className="text-slate-500 font-medium">Stochastic %K</span>
                          <span className="font-bold text-slate-700">Neutral</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NEWS TAB */}
              {activeTab === "News" && (
                <div className="news-tab-viewport space-y-6">
                  {tabDetails.news.map((item, idx) => (
                    <div key={`news-${idx}`} className="news-article-card border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{item.source}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 hover:text-[#00b074] cursor-pointer transition-colors mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#64748b] leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* EVENTS TAB */}
              {activeTab === "Events" && (
                <div className="events-tab-viewport">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-xs font-bold text-slate-400 uppercase pb-2">Event Type</th>
                          <th className="text-xs font-bold text-slate-400 uppercase pb-2">Date</th>
                          <th className="text-xs font-bold text-slate-400 uppercase pb-2">Details / Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabDetails.events.map((e, idx) => (
                          <tr key={`evt-${idx}`} className="border-b last:border-0">
                            <td className="text-xs font-bold text-slate-700 py-3">{e.type}</td>
                            <td className="text-xs font-medium text-[#00b074] py-3">{e.date}</td>
                            <td className="text-xs text-slate-500 py-3">{e.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT ORDER TICKET COLUMN */}
        <aside className="stock-trade-sidebar-column">
          <div className="groww-order-ticket-container">
            {/* Action tabs BUY/SELL */}
            <div className="ticket-action-tab-header">
              <button
                type="button"
                onClick={() => setTradeType("BUY")}
                className={`tab-btn buy ${tradeType === "BUY" ? "active" : ""}`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setTradeType("SELL")}
                className={`tab-btn sell ${tradeType === "SELL" ? "active" : ""}`}
              >
                SELL
              </button>
            </div>

            {/* Form inputs */}
            <form onSubmit={handleExecuteTrade} className="groww-ticket-form">
              
              {/* Product Pills */}
              <div className="ticket-form-section">
                <div className="product-selector-pills">
                  {["Delivery", "Intraday"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProductType(p)}
                      className={`pill-btn ${productType === p ? "active" : ""}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="ticket-form-section">
                <div className="field-input-wrapper">
                  <label className="field-label">Qty NSE</label>
                  <input
                    type="number"
                    min="1"
                    value={tradeQty}
                    onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 0))}
                    className="field-input text-right"
                    required
                  />
                </div>
              </div>

              {/* Price Type and Input */}
              <div className="ticket-form-section">
                <div className="field-input-wrapper">
                  <div className="field-label-dropdown-block">
                    <label className="field-label">Price</label>
                    <select 
                      value={priceMode} 
                      onChange={(e) => setPriceMode(e.target.value)}
                      className="price-type-select"
                    >
                      <option value="Market">Market</option>
                      <option value="Limit">Limit</option>
                    </select>
                  </div>

                  {priceMode === "Market" ? (
                    <div className="field-text-placeholder text-right">
                      At Market (₹{stockDetails.price.toFixed(2)})
                    </div>
                  ) : (
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                      className="field-input text-right"
                      required
                    />
                  )}
                </div>
              </div>

              {/* User Holding Info (Optional display if owns stock) */}
              {userPosition ? (
                <div className="ticket-position-info">
                  <span>Currently holding {userPosition.quantity} shares (Avg. ₹{userPosition.avgPrice.toFixed(2)})</span>
                </div>
              ) : null}

              {/* Balance & Approx Capital req */}
              <div className="ticket-capital-info-block">
                <div className="info-row">
                  <span className="label">Virtual Balance</span>
                  <span className="val">{formatINR(cashBalance)}</span>
                </div>
                
                <div className="info-row border-t pt-2 mt-2">
                  <span className="label font-semibold">Approx. Required</span>
                  <span className="val font-bold text-[#0f172a]">{formatINR(totalCost)}</span>
                </div>
              </div>

              {/* Buy/Sell Button */}
              <button
                type="submit"
                disabled={placingOrder}
                className={`ticket-submit-btn ${tradeType === "BUY" ? "btn-buy" : "btn-sell"}`}
              >
                {placingOrder ? (
                  <RefreshCw className="animate-spin inline" size={18} />
                ) : tradeType === "BUY" ? (
                  "Buy"
                ) : (
                  "Sell"
                )}
              </button>
            </form>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default StockDetails;