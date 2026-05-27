import {

  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,

} from "recharts";

import {

  TrendingUp,

} from "lucide-react";

const TradingChart = ({

  marketData = [],

}) => {

  const fallbackData = [

    {

      time: "09:15",

      value: 24500,

    },

    {

      time: "10:00",

      value: 24620,

    },

    {

      time: "11:00",

      value: 24580,

    },

    {

      time: "12:00",

      value: 24710,

    },

    {

      time: "01:00",

      value: 24840,

    },

    {

      time: "02:00",

      value: 24790,

    },

    {

      time: "03:00",

      value: 24890,

    },

  ];

  // CREATE DYNAMIC CHART DATA

  const chartData =

    marketData.length > 0

      ? marketData
          .slice(0, 7)
          .map(

            (
              stock,
              index
            ) => ({

              time: `${9 + index}:15`,

              value:
                Number(
                  stock.price
                ) || 0,

            })

          )

      : fallbackData;

  // PERFORMANCE

  const firstValue =
    chartData[0]?.value || 0;

  const lastValue =
    chartData[
      chartData.length - 1
    ]?.value || 0;

  const difference =
    lastValue - firstValue;

  const positive =
    difference >= 0;

  return (

    <div className="relative overflow-hidden bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

      {/* GLOW */}

      <div className="absolute top-0 right-0 h-[250px] w-[250px] bg-green-100 blur-[120px] opacity-30 rounded-full" />

      {/* HEADER */}

      <div className="relative z-10 flex items-start justify-between">

        {/* LEFT */}

        <div>

          <p className="text-[13px] font-medium text-[#64748B]">

            Market Performance

          </p>

          <h2 className="mt-2 text-[34px] font-bold tracking-tight text-[#0F172A]">

            NIFTY Trend

          </h2>

        </div>

        {/* PERFORMANCE */}

        <div
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl ${
            positive

              ? "bg-green-100 text-green-700"

              : "bg-red-100 text-red-700"
          }`}
        >

          <TrendingUp
            size={20}
          />

          <div>

            <p className="text-[11px] font-medium">

              Today

            </p>

            <h3 className="text-[18px] font-bold">

              {positive
                ? "+"
                : ""}
              {difference.toFixed(
                2
              )}

            </h3>

          </div>

        </div>

      </div>

      {/* CHART */}

      <div className="relative z-10 mt-10 h-[420px] min-h-[420px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={chartData}
          >

            {/* GRADIENT */}

            <defs>

              <linearGradient
                id="colorValue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#10B981"
                  stopOpacity={
                    0.4
                  }
                />

                <stop
                  offset="100%"
                  stopColor="#10B981"
                  stopOpacity={
                    0
                  }
                />

              </linearGradient>

            </defs>

            {/* GRID */}

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EEF2F7"
              vertical={false}
            />

            {/* X AXIS */}

            <XAxis
              dataKey="time"
              tick={{

                fontSize: 12,

                fill: "#64748B",

              }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y AXIS */}

            <YAxis
              tick={{

                fontSize: 12,

                fill: "#64748B",

              }}
              axisLine={false}
              tickLine={false}
            />

            {/* TOOLTIP */}

            <Tooltip
              contentStyle={{

                borderRadius:
                  "18px",

                border:
                  "1px solid #E8ECF2",

                boxShadow:
                  "0 6px 20px rgba(15,23,42,0.08)",

              }}
            />

            {/* AREA */}

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={4}
              fill="url(#colorValue)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

};

export default TradingChart;