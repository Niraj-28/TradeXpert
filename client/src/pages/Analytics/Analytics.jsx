import {

  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,

} from "recharts";

import {

  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,

} from "lucide-react";

const Analytics = () => {

  // PORTFOLIO GROWTH

  const growthData = [

    { month: "Jan", value: 120000 },

    { month: "Feb", value: 135000 },

    { month: "Mar", value: 128000 },

    { month: "Apr", value: 150000 },

    { month: "May", value: 172000 },

    { month: "Jun", value: 190000 },

  ];

  // WIN LOSS

  const tradeStats = [

    {
      name: "Winning",
      value: 68,
    },

    {
      name: "Losing",
      value: 32,
    },

  ];

  // MONTHLY RETURNS

  const monthlyReturns = [

    { month: "Jan", pnl: 12000 },

    { month: "Feb", pnl: 15000 },

    { month: "Mar", pnl: -7000 },

    { month: "Apr", pnl: 22000 },

    { month: "May", pnl: 18000 },

    { month: "Jun", pnl: 26000 },

  ];

  const COLORS = [

    "#10B981",
    "#EF4444",

  ];

  const totalPnL = 86000;

  const positive =
    totalPnL >= 0;

  return (

    <div className="min-h-screen bg-[#F4F7FB] px-5 lg:px-8 py-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <p className="text-[14px] text-[#64748B] font-medium">

            Advanced Trading Insights

          </p>

          <h1 className="mt-2 text-[42px] font-bold tracking-tight text-[#0F172A]">

            Analytics

          </h1>

        </div>

      </div>

      {/* STATS */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* TOTAL PNL */}

        <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[13px] text-[#64748B]">

                Total Profit/Loss

              </p>

              <h2
                className={`mt-3 text-[38px] font-bold tracking-tight ${
                  positive

                    ? "text-green-600"

                    : "text-red-600"
                }`}
              >

                ₹
                {totalPnL.toLocaleString()}

              </h2>

            </div>

            <div
              className={`h-14 w-14 rounded-2xl text-white flex items-center justify-center ${
                positive

                  ? "bg-green-500"

                  : "bg-red-500"
              }`}
            >

              {positive ? (

                <TrendingUp
                  size={24}
                />

              ) : (

                <TrendingDown
                  size={24}
                />

              )}

            </div>

          </div>

        </div>

        {/* WIN RATE */}

        <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[13px] text-[#64748B]">

                Win Ratio

              </p>

              <h2 className="mt-3 text-[38px] font-bold tracking-tight text-[#0F172A]">

                68%

              </h2>

            </div>

            <div className="h-14 w-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center">

              <Activity size={24} />

            </div>

          </div>

        </div>

        {/* TOTAL TRADES */}

        <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[13px] text-[#64748B]">

                Total Trades

              </p>

              <h2 className="mt-3 text-[38px] font-bold tracking-tight text-[#0F172A]">

                248

              </h2>

            </div>

            <div className="h-14 w-14 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center">

              <BarChart3 size={24} />

            </div>

          </div>

        </div>

      </section>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">

        {/* LEFT */}

        <div className="2xl:col-span-8 space-y-6">

          {/* PORTFOLIO GROWTH */}

          <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

            <div className="mb-8">

              <p className="text-[13px] text-[#64748B] font-medium">

                Growth Analytics

              </p>

              <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

                Portfolio Growth

              </h2>

            </div>

            <div className="h-[420px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={growthData}
                >

                  <defs>

                    <linearGradient
                      id="growth"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#10B981"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="100%"
                        stopColor="#10B981"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EEF2F7"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={4}
                    fill="url(#growth)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* MONTHLY RETURNS */}

          <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

            <div className="mb-8">

              <p className="text-[13px] text-[#64748B] font-medium">

                Monthly Analysis

              </p>

              <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

                Monthly Returns

              </h2>

            </div>

            <div className="h-[350px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={monthlyReturns}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EEF2F7"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="pnl"
                    radius={[
                      12,
                      12,
                      0,
                      0,
                    ]}
                    fill="#10B981"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="2xl:col-span-4 space-y-6">

          {/* WIN LOSS */}

          <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

            <div className="mb-8">

              <p className="text-[13px] text-[#64748B] font-medium">

                Trade Performance

              </p>

              <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

                Win/Loss Ratio

              </h2>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={tradeStats}
                    dataKey="value"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={4}
                  >

                    {tradeStats.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* INSIGHTS */}

          <div className="bg-[#0F172A] rounded-[30px] p-6 text-white">

            <p className="text-[13px] text-gray-400">

              Trading Insights

            </p>

            <h2 className="mt-2 text-[30px] font-bold tracking-tight">

              Performance Summary

            </h2>

            <div className="mt-8 space-y-5">

              <div>

                <p className="text-[13px] text-gray-400">

                  Best Performing Month

                </p>

                <h3 className="mt-2 text-[22px] font-bold">

                  June +₹26,000

                </h3>

              </div>

              <div>

                <p className="text-[13px] text-gray-400">

                  Average Monthly Return

                </p>

                <h3 className="mt-2 text-[22px] font-bold">

                  +12.4%

                </h3>

              </div>

              <div>

                <p className="text-[13px] text-gray-400">

                  Trading Accuracy

                </p>

                <h3 className="mt-2 text-[22px] font-bold">

                  68% Win Rate

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Analytics;