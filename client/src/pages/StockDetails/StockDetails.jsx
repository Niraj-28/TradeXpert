import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { socket } from "../../services/socket";
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
  TrendingUp as BuyIcon, ShieldAlert, Award, Globe, Calendar, FileText,
  Clock, ChevronRight, Activity
} from "lucide-react";
import toast from "react-hot-toast";
import StockLogo from "../../components/ui/StockLogo";
import { getLiveNews } from "../../services/marketApi";

// Format currency
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};



// Deterministic mock data seed for custom stocks
const getInitialStockStats = (symbol) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const open = Math.abs(hash % 2900) + 100;
  const changePercent = ((hash % 100) / 25) - 2; // -2% to +2%
  const changeVal = open * (changePercent / 100);
  const price = open + changeVal;
  const high = Math.max(price, open) * (1 + 0.012);
  const low = Math.min(price, open) * (1 - 0.012);
  
  const yLow = low * 0.92;
  const yHigh = high * 1.15;

  return {
    symbol: symbol.toUpperCase(),
    companyName: symbol.toUpperCase() + " Technologies India",
    price: parseFloat(price.toFixed(2)),
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

  const getRelativeDateString = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

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
    { type: "Board Meeting", date: getRelativeDateString(10), purpose: "Audited Financial Results & dividend consideration" },
    { type: "Dividend Paid", date: getRelativeDateString(-15), purpose: "Final Dividend of ₹" + ((Math.abs(hash) % 15) + 5) + ".50 per equity share" },
    { type: "Corporate Action", date: getRelativeDateString(-45), purpose: "1:1 Bonus Shares Issue Approval" },
    { type: "AGM Scheduled", date: getRelativeDateString(30), purpose: "Annual General Meeting to approve auditor appointments" }
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

const getMarketTimeLabels = (pointsCount, now) => {
  const marketStart = new Date(now);
  marketStart.setHours(9, 15, 0, 0);
  
  const marketEnd = new Date(now);
  marketEnd.setHours(15, 30, 0, 0);
  
  let chartEnd = marketEnd;
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const isTodayMarketTime = (currentHour > 9 || (currentHour === 9 && currentMin >= 15)) && (currentHour < 15 || (currentHour === 15 && currentMin <= 30));
  
  if (isTodayMarketTime) {
    chartEnd = now;
  }
  
  const startMs = marketStart.getTime();
  const endMs = chartEnd.getTime();
  const diffMs = Math.max(1000, endMs - startMs);
  const stepMs = diffMs / (pointsCount - 1);
  
  const labels = [];
  for (let i = 0; i < pointsCount; i++) {
    const time = new Date(startMs + i * stepMs);
    const label = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
    labels.push(label);
  }
  return labels;
};

// Seed deterministic historical data (Line and Candle options) scaled to currentPrice
const generateStaticChartData = (symbol, timeframe, currentPrice, isCandle, openPrice, highPrice, lowPrice) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let pointsCount = 60;
  let intervalDays = 1;
  
  if (timeframe === "1D") {
    pointsCount = 75;
  } else if (timeframe === "1W") {
    pointsCount = 50;
    intervalDays = 0.2; // multiple points per day
  } else if (timeframe === "1M") {
    pointsCount = 60;
    intervalDays = 0.5;
  } else if (timeframe === "3M") {
    pointsCount = 90;
    intervalDays = 1;
  } else if (timeframe === "1Y") {
    pointsCount = 120;
    intervalDays = 3;
  } else if (timeframe === "ALL") {
    pointsCount = 180;
    intervalDays = 10;
  }
  
  const now = new Date();
  const data = [];
  
  if (timeframe === "1D") {
    // 1D timeframe: generate intermediate points between openPrice and currentPrice,
    // bounded by lowPrice and highPrice.
    const open = openPrice || currentPrice * 0.99;
    const close = currentPrice;
    const high = highPrice || Math.max(open, close) * 1.01;
    const low = lowPrice || Math.min(open, close) * 0.99;
    const range = high - low || 1.0;
    
    const labels = getMarketTimeLabels(pointsCount, now);
    
    for (let i = 0; i < pointsCount; i++) {
      const t = i / (pointsCount - 1);
      // Base linear interpolation
      let price = open + (close - open) * t;
      
      // Add deterministic wave perturbation (0 at endpoints i=0 and i=pointsCount-1)
      if (i > 0 && i < pointsCount - 1) {
        const wave = Math.sin(Math.PI * t) * (
          Math.sin(hash + i * 0.8) * 0.45 +
          Math.cos(hash * 2 - i * 1.4) * 0.25 +
          Math.sin(hash * 0.5 + i * 2.2) * 0.15
        );
        // Volatility scale
        const vol = range * 0.3; // perturbation can go up to 30% of day's range
        price += wave * vol;
      }
      
      // Clamp to [low, high]
      price = Math.max(low + range * 0.02, Math.min(high - range * 0.02, price));
      
      // At endpoints, be exact
      if (i === 0) price = open;
      if (i === pointsCount - 1) price = close;
      
      const label = labels[i];
      
      if (isCandle) {
        const cClose = price;
        const cOpen = (i === 0) ? (open - (close - open) * 0.05) : (data[i - 1] ? data[i - 1].close : open);
        const diff = Math.abs(cClose - cOpen) || (range * 0.05);
        const cHigh = Math.max(cOpen, cClose) + (range * 0.05 * Math.abs(Math.sin(hash + i)));
        const cLow = Math.min(cOpen, cClose) - (range * 0.05 * Math.abs(Math.cos(hash + i)));
        data.push({
          time: label,
          open: parseFloat(cOpen.toFixed(2)),
          close: parseFloat(cClose.toFixed(2)),
          high: parseFloat(Math.min(high, cHigh).toFixed(2)),
          low: parseFloat(Math.max(low, cLow).toFixed(2)),
          range: [parseFloat(Math.min(cOpen, cClose).toFixed(2)), parseFloat(Math.max(cOpen, cClose).toFixed(2))]
        });
      } else {
        data.push({
          time: label,
          price: parseFloat(price.toFixed(2)),
        });
      }
    }
  } else {
    // Longer timeframe: generate points backward from currentPrice
    const factors = [1.0];
    let currentFactor = 1.0;
    
    for (let i = 1; i < pointsCount; i++) {
      // Deterministic return
      const seed = Math.sin(hash - i) * 1.5;
      const trend = (hash % 8 - 4) / 4.0; // -1 to +1
      const r = (seed + trend * 0.5) / 100; // -2% to +2% per interval
      currentFactor = currentFactor / (1 + r);
      factors.unshift(currentFactor);
    }
    
    // Calculate prices based on factors, scaled so the last one is exactly currentPrice
    for (let i = 0; i < pointsCount; i++) {
      const date = new Date(now.getTime() - (pointsCount - 1 - i) * intervalDays * 24 * 60 * 60 * 1000);
      const pointPrice = currentPrice * factors[i];
      
      let label = "";
      if (timeframe === "1W") {
        label = date.toLocaleDateString("en-IN", { weekday: "short" });
      } else if (timeframe === "1M" || timeframe === "3M") {
        label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      } else {
        label = date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      }
      
      if (isCandle) {
        const cClose = pointPrice;
        const cOpen = (i === 0) ? (pointPrice / (1 + (Math.sin(hash) * 0.8) / 100)) : (data[i - 1] ? data[i - 1].close : pointPrice);
        const diff = Math.abs(cClose - cOpen) || 1;
        const cHigh = Math.max(cOpen, cClose) + diff * 0.3 * Math.abs(Math.sin(hash + i));
        const cLow = Math.min(cOpen, cClose) - diff * 0.3 * Math.abs(Math.cos(hash + i));
        data.push({
          time: label,
          open: parseFloat(cOpen.toFixed(2)),
          close: parseFloat(cClose.toFixed(2)),
          high: parseFloat(cHigh.toFixed(2)),
          low: parseFloat(cLow.toFixed(2)),
          range: [parseFloat(Math.min(cOpen, cClose).toFixed(2)), parseFloat(Math.max(cOpen, cClose).toFixed(2))]
        });
      } else {
        data.push({
          time: label,
          price: parseFloat(pointPrice.toFixed(2)),
        });
      }
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
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    // Initial load from mock fallback
    const seedStats = getInitialStockStats(symbol);
    const mockNews = getStockTabDetails(symbol, seedStats.price).news;
    setNewsList(mockNews);
    
    const fetchLiveStockNews = async () => {
      try {
        const allNews = await getLiveNews();
        const symUpper = symbol.toUpperCase();
        const filtered = allNews.filter(article => {
          const titleUpper = (article.title || "").toUpperCase();
          const summaryUpper = (article.summary || "").toUpperCase();
          const artSymbolUpper = (article.symbol || "").toUpperCase();
          
          return artSymbolUpper === symUpper || 
                 titleUpper.includes(symUpper) || 
                 summaryUpper.includes(symUpper);
        });
        
        if (filtered.length > 0) {
          setNewsList(filtered);
        } else if (allNews && allNews.length > 0) {
          setNewsList(allNews.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch live stock news:", err);
      }
    };
    fetchLiveStockNews();
  }, [symbol]);

  // Order Ticket states
  const [tradeType, setTradeType] = useState(initialType);
  const [productType, setProductType] = useState("Delivery"); // Delivery | Intraday
  const [priceMode, setPriceMode] = useState("Market"); // Market | Limit
  const [tradeQty, setTradeQty] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [exchange, setExchange] = useState("NSE"); // NSE | BSE
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
      const prevClose = price / (1 + change / 100);
      const changeAmt = price - prevClose;
      const open = parseFloat(liveStock.open) || prevClose;
      const high = parseFloat(liveStock.high) || Math.max(price, open) * 1.015;
      const low = parseFloat(liveStock.low) || Math.min(price, open) * 0.985;
      
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
        prevClose,
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

  // Register dynamic view-stock in backend dynamically and scroll page to top
  useEffect(() => {
    window.scrollTo(0, 0);
    if (symbol) {
      socket.emit("view-stock", symbol);
    }
    return () => {
      socket.emit("unview-stock");
    };
  }, [symbol]);

  // Listen to background order execution
  useEffect(() => {
    const handleOrderExecuted = (data) => {
      if (data && data.symbol?.toUpperCase() === symbol.toUpperCase()) {
        fetchUserData();
      }
    };
    socket.on("order-executed", handleOrderExecuted);
    return () => {
      socket.off("order-executed", handleOrderExecuted);
    };
  }, [symbol]);

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

  // Dynamic Chart Points compiler
  const chartData = useMemo(() => {
    const isCandle = chartType === "candle";
    return generateStaticChartData(
      symbol,
      timeframe,
      stockDetails.price,
      isCandle,
      stockDetails.open,
      stockDetails.high,
      stockDetails.low
    );
  }, [symbol, timeframe, chartType, stockDetails.price, stockDetails.open, stockDetails.high, stockDetails.low]);

  const yDomain = useMemo(() => {
    if (!chartData || chartData.length === 0) return ["auto", "auto"];
    
    let minVal = Infinity;
    let maxVal = -Infinity;
    
    chartData.forEach(d => {
      if (chartType === "candle") {
        if (d.low < minVal) minVal = d.low;
        if (d.high > maxVal) maxVal = d.high;
      } else {
        if (d.price < minVal) minVal = d.price;
        if (d.price > maxVal) maxVal = d.price;
      }
    });
    
    if (minVal === Infinity || maxVal === -Infinity) return ["auto", "auto"];
    
    const padding = (maxVal - minVal) * 0.05 || 10;
    return [Math.floor(minVal - padding), Math.ceil(maxVal + padding)];
  }, [chartData, chartType]);

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
        exchange: exchange,
        priceMode: priceMode.toUpperCase()
      });

      if (priceMode === "Limit") {
        toast.success(`Limit order placed at ₹${Number(execPrice).toFixed(2)} on ${exchange}`);
      } else {
        toast.success(`Market order submitted: ${tradeType} ${tradeQty} shares on ${exchange}`);
      }

      fetchUserData();

    } catch (err) {
      toast.error(err.response?.data?.message || "Virtual execution failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  const isPositive = useMemo(() => {
    if (!chartData || chartData.length < 2) return stockDetails.change >= 0;
    const start = chartType === "candle" ? chartData[0].open : chartData[0].price;
    const end = chartType === "candle" ? chartData[chartData.length - 1].close : chartData[chartData.length - 1].price;
    return end >= start;
  }, [chartData, chartType, stockDetails.change]);
  const totalCost = tradeQty * (priceMode === "Market" ? stockDetails.price : limitPrice);

  return (
    <div className="stock-details-page-container">
      {/* 2-COLUMN VIEWPORT */}
      <div className="stock-details-grid-wrapper">
        
        {/* LEFT COMPONENT COLUMN */}
        <div className="stock-info-main-column">
          
          {/* Header block */}
          <div className="stock-profile-header-card">
            <StockLogo symbol={symbol} size={64} />
            
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
                      domain={yDomain} 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      orientation="right" 
                      formatter={(v) => "₹" + Number(v).toFixed(2)}
                    />
                    <Tooltip 
                      formatter={(v) => ["₹" + Number(v).toFixed(2), "LTP"]}
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
                      domain={yDomain} 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      orientation="right"
                      formatter={(v) => "₹" + Number(v).toFixed(2)}
                    />
                    <Tooltip 
                      formatter={(v, name, props) => {
                        const { open, close, high, low } = props.payload;
                        return [
                          `Open: ₹${Number(open).toFixed(2)} | Close: ₹${Number(close).toFixed(2)} | High: ₹${Number(high).toFixed(2)} | Low: ₹${Number(low).toFixed(2)}`,
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
                <div className="premium-technicals-layout">
                  <div className="sentiment-gauge-card">
                    <span className="section-subtitle">MARKET SENTIMENT</span>
                    <div className="sentiment-main-row">
                      <span className={`sentiment-text-badge ${tabDetails.sentiment.toLowerCase()}`}>
                        {tabDetails.sentiment}
                      </span>
                      <span className="sync-badge">EMA / SMA Sync</span>
                    </div>
                    
                    <div className="gauge-track-container">
                      <div className="gauge-track">
                        <div className="gauge-segment bearish" />
                        <div className="gauge-segment neutral" />
                        <div className="gauge-segment bullish" />
                        <div 
                          className="gauge-pointer" 
                          style={{ 
                            left: tabDetails.sentiment === "Bullish" ? "85%" : 
                                  tabDetails.sentiment === "Bearish" ? "15%" : "50%" 
                          }}
                        />
                      </div>
                      <div className="gauge-labels-row">
                        <span className="label-text text-bearish">Bearish</span>
                        <span className="label-text text-neutral">Neutral</span>
                        <span className="label-text text-bullish">Bullish</span>
                      </div>
                    </div>
                  </div>

                  <div className="technical-indicators-grid">
                    {/* Moving Averages Card */}
                    <div className="indicator-group-card">
                      <div className="card-header">
                        <TrendingUp size={16} className="header-icon text-[#00b074]" />
                        <h4>Moving Averages</h4>
                      </div>
                      <div className="indicators-list">
                        <div className="indicator-row">
                          <span className="ind-name">EMA (20)</span>
                          <span className="ind-val">{formatINR(tabDetails.ema20)}</span>
                          <span className="ind-status buy">Bullish</span>
                        </div>
                        <div className="indicator-row">
                          <span className="ind-name">SMA (50)</span>
                          <span className="ind-val">{formatINR(tabDetails.sma50)}</span>
                          <span className="ind-status buy">Bullish</span>
                        </div>
                        <div className="indicator-row">
                          <span className="ind-name">SMA (100)</span>
                          <span className="ind-val">{formatINR(tabDetails.sma100)}</span>
                          <span className="ind-status buy">Bullish</span>
                        </div>
                        <div className="indicator-row">
                          <span className="ind-name">SMA (200)</span>
                          <span className="ind-val">{formatINR(tabDetails.sma200)}</span>
                          <span className="ind-status buy">Bullish</span>
                        </div>
                      </div>
                    </div>

                    {/* Oscillators Card */}
                    <div className="indicator-group-card">
                      <div className="card-header">
                        <Activity size={16} className="header-icon text-indigo-500" />
                        <h4>Oscillators</h4>
                      </div>
                      <div className="indicators-list">
                        <div className="indicator-row">
                          <span className="ind-name">RSI (14)</span>
                          <div className="ind-val-wrapper">
                            <span className="ind-val font-bold">{tabDetails.rsi}</span>
                            <span className="ind-status-sub">{tabDetails.rsiStatus}</span>
                          </div>
                          <span className={`ind-status ${tabDetails.rsi > 70 ? "sell" : tabDetails.rsi < 30 ? "buy" : "neutral"}`}>
                            {tabDetails.rsi > 70 ? "Overbought" : tabDetails.rsi < 30 ? "Oversold" : "Neutral"}
                          </span>
                        </div>
                        <div className="indicator-row">
                          <span className="ind-name">MACD (12, 26)</span>
                          <span className="ind-val">—</span>
                          <span className="ind-status buy">Buy Signal</span>
                        </div>
                        <div className="indicator-row">
                          <span className="ind-name">Stochastic %K</span>
                          <span className="ind-val">—</span>
                          <span className="ind-status neutral">Neutral</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NEWS TAB */}
              {activeTab === "News" && (
                <div className="premium-news-layout">
                  {newsList.map((item, idx) => (
                    <div key={`news-${idx}`} className="news-feed-card">
                      <div className="news-card-meta">
                        <span className={`news-source-tag ${(item.source || "").toLowerCase().replace(/\s+/g, '-')}`}>
                          {item.source}
                        </span>
                        <span className="news-time-dot">•</span>
                        <span className="news-time-label">
                          <Clock size={11} className="inline mr-1 align-middle" />
                          {item.time}
                        </span>
                      </div>
                      <h3 className="news-card-title">{item.title}</h3>
                      <p className="news-card-summary">{item.summary}</p>
                      <div className="news-card-footer">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="read-more-link">
                            Read full coverage
                            <ChevronRight size={14} className="arrow-icon ml-1 inline" />
                          </a>
                        ) : (
                          <a href="#news-link" className="read-more-link" onClick={(e) => e.preventDefault()}>
                            Read full analysis
                            <ChevronRight size={14} className="arrow-icon ml-1 inline" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EVENTS TAB */}
              {activeTab === "Events" && (
                <div className="premium-events-timeline">
                  <div className="timeline-spine" />
                  {tabDetails.events.map((e, idx) => {
                    let icon = <FileText size={14} />;
                    let typeClass = "meeting";
                    if (e.type.includes("Dividend")) {
                      icon = <Award size={14} />;
                      typeClass = "dividend";
                    } else if (e.type.includes("Action") || e.type.includes("Bonus")) {
                      icon = <Settings size={14} />;
                      typeClass = "action";
                    } else if (e.type.includes("AGM")) {
                      icon = <Globe size={14} />;
                      typeClass = "agm";
                    }
                    
                    const parts = e.date.split(" ");
                    const month = parts[0] ? parts[0].slice(0, 3).toUpperCase() : "EVT";
                    const day = parts[1] ? parts[1].replace(",", "") : "—";
                    const year = parts[2] || "";

                    return (
                      <div key={`evt-${idx}`} className="timeline-node">
                        <div className="event-date-badge">
                          <span className="badge-month">{month}</span>
                          <span className="badge-day">{day}</span>
                          <span className="badge-year">{year}</span>
                        </div>

                        <div className={`timeline-bullet-icon ${typeClass}`}>
                          {icon}
                        </div>

                        <div className="event-details-card">
                          <div className="event-header-row">
                            <span className={`event-type-tag ${typeClass}`}>{e.type}</span>
                            <span className="event-date-string">{e.date}</span>
                          </div>
                          <p className="event-purpose-text">{e.purpose}</p>
                        </div>
                      </div>
                    );
                  })}
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

              {/* Exchange Selector */}
              <div className="ticket-form-section">
                <div className="exchange-selector-pills">
                  {["NSE", "BSE"].map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setExchange(ex)}
                      className={`exchange-pill-btn ${exchange === ex ? "active" : ""}`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="ticket-form-section">
                <div className="field-input-wrapper">
                  <label className="field-label">Qty {exchange}</label>
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