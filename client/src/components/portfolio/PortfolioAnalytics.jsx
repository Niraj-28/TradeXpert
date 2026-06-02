import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Brand color palette for pie chart slices
const COLORS = [
  "#408A71", // Brand Accent (Emerald Green)
  "#091413", // Brand Dark (Navy)
  "#285A48", // Brand Primary (Forest Green)
  "#B0E4CC", // Brand Mint
  "#4f46e5", // Indigo
  "#0ea5e9", // Sky Blue
  "#f59e0b", // Amber/Gold
  "#ec4899", // Pink
];

const PortfolioAnalytics = ({ holdings = [], cash = 0 }) => {
  // Construct dynamic data slices
  const chartData = holdings.map((h) => ({
    name: h.symbol,
    value: parseFloat(h.currentVal.toFixed(2)),
  }));

  // Append cash as a slice if available
  if (cash > 0) {
    chartData.push({
      name: "Available Cash",
      value: parseFloat(cash.toFixed(2)),
    });
  }

  // Fallback default data if everything is empty
  const hasData = chartData.some((d) => d.value > 0);
  const dataToRender = hasData
    ? chartData
    : [
        { name: "Available Capital", value: 1000000 },
      ];

  const totalValue = dataToRender.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="portfolio-analytics-card">
      <div className="analytics-card-header">
        <h2 className="analytics-card-title">Asset Distribution</h2>
        <p className="analytics-card-subtitle">Relative value weightage of your simulation assets</p>
      </div>

      <div className="analytics-chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataToRender}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {dataToRender.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `₹${value.toLocaleString("en-IN")}`,
                "Current Value",
              ]}
              contentStyle={{
                borderRadius: "14px",
                fontFamily: "Poppins, sans-serif",
                fontSize: "12px",
                border: "1px solid #e8edf5",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text displaying total capital */}
        <div className="analytics-chart-center-label">
          <span className="analytics-total-label">Total Value</span>
          <span className="analytics-total-value">
            ₹{Math.round(totalValue).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Dynamic Legend List Grid */}
      <div className="analytics-legend-grid">
        {dataToRender.map((item, index) => {
          const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
          return (
            <div key={`${item.name}-${index}`} className="analytics-legend-item">
              <span
                className="analytics-legend-dot"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="analytics-legend-name">{item.name}</span>
              <span className="analytics-legend-pct">{percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioAnalytics;