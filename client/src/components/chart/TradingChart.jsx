import { useMemo, useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";

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

// Helper to seed deterministic historical data based on stock symbol scaled to currentPrice
const generateStaticChartData = (symbol, timeframe, currentPrice, openPrice, highPrice, lowPrice) => {
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
    const open = openPrice || currentPrice * 0.99;
    const close = currentPrice;
    const high = highPrice || Math.max(open, close) * 1.01;
    const low = lowPrice || Math.min(open, close) * 0.99;
    const range = high - low || 1.0;
    
    const labels = getMarketTimeLabels(pointsCount, now);
    
    for (let i = 0; i < pointsCount; i++) {
      const t = i / (pointsCount - 1);
      let price = open + (close - open) * t;
      
      if (i > 0 && i < pointsCount - 1) {
        const wave = Math.sin(Math.PI * t) * (
          Math.sin(hash + i * 0.8) * 0.45 +
          Math.cos(hash * 2 - i * 1.4) * 0.25 +
          Math.sin(hash * 0.5 + i * 2.2) * 0.15
        );
        const vol = range * 0.3;
        price += wave * vol;
      }
      
      price = Math.max(low + range * 0.02, Math.min(high - range * 0.02, price));
      
      if (i === 0) price = open;
      if (i === pointsCount - 1) price = close;
      
      const label = labels[i];
      
      data.push({
        time: label,
        price: parseFloat(price.toFixed(2)),
      });
    }
  } else {
    const factors = [1.0];
    let currentFactor = 1.0;
    
    for (let i = 1; i < pointsCount; i++) {
      const seed = Math.sin(hash - i) * 1.5;
      const trend = (hash % 8 - 4) / 4.0;
      const r = (seed + trend * 0.5) / 100;
      currentFactor = currentFactor / (1 + r);
      factors.unshift(currentFactor);
    }
    
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
      
      data.push({
        time: label,
        price: parseFloat(pointPrice.toFixed(2)),
      });
    }
  }
  
  return data;
};
 
const TradingChart = ({ symbol = "RELIANCE", timeframe = "1D", currentPrice = 1300, openPrice = null, highPrice = null, lowPrice = null }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/market/history`, {
          params: { symbol, timeframe }
        });
        if (active) {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setChartData(res.data);
          } else {
            const fallback = generateStaticChartData(symbol, timeframe, currentPrice, openPrice, highPrice, lowPrice);
            setChartData(fallback);
          }
        }
      } catch (err) {
        console.error("Error fetching yahoo history, using fallback:", err.message);
        if (active) {
          const fallback = generateStaticChartData(symbol, timeframe, currentPrice, openPrice, highPrice, lowPrice);
          setChartData(fallback);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchHistory();
    return () => {
      active = false;
    };
  }, [symbol, timeframe, currentPrice, openPrice, highPrice, lowPrice]);

  // Determine trend direction (green/red)
  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    const start = chartData[0].price;
    const end = chartData[chartData.length - 1].price;
    return end >= start;
  }, [chartData]);

  const strokeColor = isPositive ? "#10b981" : "#ef4444";
  const gradientId = `chartGradient-${symbol.replace(/[^a-zA-Z0-9]/g, "")}-${timeframe}`;

  return (
    <div className="trading-chart-responsive-box">
      {chartData.length === 0 ? (
        <div className="chart-loading-overlay">
          <span>Connecting to live quote feed to draw line...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.24} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              domain={["auto", "auto"]} 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
              orientation="right"
              formatter={(value) => "₹" + Number(value).toFixed(2)}
            />
            <Tooltip 
              formatter={(value) => ["₹" + Number(value).toFixed(2), "Price"]}
              contentStyle={{
                borderRadius: "8px",
                fontFamily: "Poppins, sans-serif",
                fontSize: "12px",
                border: "1px solid #e8edf5",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
                background: "#ffffff",
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2.4}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TradingChart;