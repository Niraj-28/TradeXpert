import {

  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,

} from "recharts";

import {

  TrendingUp,
  TrendingDown,
  Wallet,

} from "lucide-react";

const Holdings = ({

  holdings = [],

}) => {

  // FALLBACK DATA

  const fallbackHoldings = [

    {

      symbol: "RELIANCE",

      quantity: 10,

      avgPrice: 2800,

      currentPrice: 2985,

    },

    {

      symbol: "TCS",

      quantity: 5,

      avgPrice: 3700,

      currentPrice: 3850,

    },

    {

      symbol: "INFY",

      quantity: 12,

      avgPrice: 1500,

      currentPrice: 1620,

    },

  ];

  const portfolio =

    holdings.length > 0

      ? holdings

      : fallbackHoldings;

  // TOTALS

  const totalInvestment =

    portfolio.reduce(

      (acc, item) =>

        acc +

        item.avgPrice *
          item.quantity,

      0

    );

  const currentValue =

    portfolio.reduce(

      (acc, item) =>

        acc +

        item.currentPrice *
          item.quantity,

      0

    );

  const totalPnL =

    currentValue -
    totalInvestment;

  const positive =
    totalPnL >= 0;

  // CHART DATA

  const chartData =
    portfolio.map((item) => ({

      name: item.symbol,

      value:
        item.currentPrice *
        item.quantity,

    }));

  const COLORS = [

    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",

  ];

  return (

    <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[13px] text-[#64748B] font-medium">

            Portfolio Overview

          </p>

          <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

            Holdings

          </h2>

        </div>

        <div className="h-12 w-12 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center">

          <Wallet size={22} />

        </div>

      </div>

      {/* TOTAL VALUE */}

      <div className="mt-8 p-6 rounded-[28px] bg-[#0F172A] text-white">

        <p className="text-[13px] text-gray-300">

          Current Portfolio Value

        </p>

        <h1 className="mt-3 text-[44px] font-bold tracking-tight">

          ₹
          {currentValue.toLocaleString()}
        </h1>

        <div className="mt-5 flex items-center gap-3">

          <div
            className={`px-4 py-2 rounded-2xl text-[13px] font-bold flex items-center gap-2 ${
              positive

                ? "bg-green-500"

                : "bg-red-500"
            }`}
          >

            {positive ? (

              <TrendingUp
                size={18}
              />

            ) : (

              <TrendingDown
                size={18}
              />

            )}

            ₹
            {Math.abs(
              totalPnL
            ).toFixed(2)}

          </div>

          <p className="text-[13px] text-gray-300">

            Total P&L

          </p>

        </div>

      </div>

      {/* ALLOCATION */}

      <div className="mt-10">

        <div className="flex items-center justify-between mb-5">

          <h3 className="text-[22px] font-bold text-[#0F172A]">

            Portfolio Allocation

          </h3>

        </div>

        {/* CHART */}

        <div className="h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
              >

                {chartData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
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

      {/* HOLDINGS LIST */}

      <div className="mt-10 space-y-4">

        {portfolio.map(
          (stock) => {

            const invested =

              stock.avgPrice *
              stock.quantity;

            const current =

              stock.currentPrice *
              stock.quantity;

            const pnl =
              current -
              invested;

            const gain =
              pnl >= 0;

            return (

              <div
                key={stock.symbol}
                className="flex items-center justify-between p-5 rounded-[24px] border border-[#EEF2F7] hover:bg-[#FAFBFC] transition-all"
              >

                {/* LEFT */}

                <div>

                  <h3 className="text-[22px] font-bold text-[#0F172A]">

                    {stock.symbol}

                  </h3>

                  <p className="mt-1 text-[13px] text-[#64748B]">

                    Qty{" "}
                    {
                      stock.quantity
                    }{" "}
                    • Avg ₹
                    {
                      stock.avgPrice
                    }

                  </p>

                </div>

                {/* RIGHT */}

                <div className="text-right">

                  <h2 className="text-[28px] font-bold text-[#0F172A]">

                    ₹
                    {current.toFixed(
                      2
                    )}

                  </h2>

                  <div
                    className={`mt-2 inline-flex px-4 py-2 rounded-2xl text-[13px] font-bold ${
                      gain

                        ? "bg-green-100 text-green-700"

                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {gain
                      ? "+"
                      : "-"}
                    ₹
                    {Math.abs(
                      pnl
                    ).toFixed(2)}

                  </div>

                </div>

              </div>

            );

          }

        )}

      </div>

    </div>

  );

};

export default Holdings;