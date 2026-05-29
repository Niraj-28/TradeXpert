import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Helper to seed deterministic historical data based on stock symbol
const generateHistoricalData = (symbol, timeframe) => {
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
  } else if (timeframe === "1Y") {
    pointsCount = 12;
    intervalDays = 30;
  }

  const data = [];
  let currentPrice = basePrice * 0.95;
  const now = new Date();

  for (let i = pointsCount - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * intervalDays * 24 * 60 * 60 * 1000);
    
    // Deterministic fluctuation using hash and index
    const seed = Math.sin(hash + i) * 1.5;
    const trend = (i / pointsCount) * (hash % 10 - 5); // Add general upward/downward trend
    const pct = (seed + trend) / 100;
    currentPrice = currentPrice * (1 + pct);

    let label = "";
    if (timeframe === "1W") {
      label = date.toLocaleDateString("en-IN", { weekday: "short" });
    } else if (timeframe === "1M") {
      label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } else if (timeframe === "1Y") {
      label = date.toLocaleDateString("en-IN", { month: "short" });
    }

    data.push({
      time: label,
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }

  return data;
};

const TradingChart = ({ symbol = "RELIANCE", timeframe = "1D", liveTicks = [] }) => {
  // Memoize data calculation
  const chartData = useMemo(() => {
    if (timeframe === "1D") {
      // Return live scrolling ticks formatted for Recharts
      return liveTicks.map((t, idx) => ({
        time: t.time || `${idx * 3}s`,
        price: t.price,
      }));
    }
    // Return generated historical points
    return generateHistoricalData(symbol, timeframe);
  }, [symbol, timeframe, liveTicks]);

  // Determine trend direction (green/red)
  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    const start = chartData[0].price;
    const end = chartData[chartData.length - 1].price;
    return end >= start;
  }, [chartData]);

  const strokeColor = isPositive ? "#10b981" : "#ef4444";
  const gradientId = `chartGradient-${symbol}-${timeframe}`;

  return (
    <div className="trading-chart-responsive-box">
      {chartData.length === 0 ? (
        <div className="chart-loading-overlay">
          <span>Connecting to live quote feed to draw line...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={380}>
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
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            />
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Price"]}
              contentStyle={{
                borderRadius: "14px",
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