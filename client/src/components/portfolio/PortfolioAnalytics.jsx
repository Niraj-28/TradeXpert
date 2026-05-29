import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#37c98b", // Emerald/Green
  "#0f172a", // Navy Blue
  "#4f46e5", // Indigo
  "#0ea5e9", // Sky Blue
  "#f59e0b", // Amber/Gold
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#94a3b8", // Slate
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
    <div className="bg-white rounded-[30px] border border-[#e8edf5] p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-[#0f172a]">
          Asset Distribution
        </h2>
        <p className="text-xs text-slate-400 mt-1">Relative value weightage of your simulation assets</p>
      </div>

      <div className="h-[280px] relative">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Value
          </span>
          <span className="text-sm font-extrabold text-[#0f172a] mt-1">
            ₹{Math.round(totalValue).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Dynamic Legend List Grid */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-4">
        {dataToRender.map((item, index) => {
          const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
          return (
            <div key={`${item.name}-${index}`} className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs font-semibold text-[#334155] truncate max-w-[100px]">
                {item.name}
              </span>
              <span className="text-[11px] font-bold text-slate-400 ml-auto">
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioAnalytics;