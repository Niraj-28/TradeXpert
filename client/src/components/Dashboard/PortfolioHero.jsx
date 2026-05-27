import {

  TrendingUp,
  Wallet,

} from "lucide-react";

const PortfolioHero = ({

  holdings = [],

}) => {

  // TOTAL INVESTMENT

  const totalInvestment =

    holdings.reduce(

      (acc, item) =>

        acc +

        item.avgPrice *
          item.quantity,

      0

    );

  // CURRENT VALUE

  const currentValue =

    holdings.reduce(

      (acc, item) =>

        acc +

        item.currentPrice *
          item.quantity,

      0

    );

  // PROFIT

  const totalProfit =

    currentValue -
    totalInvestment;

  // PERCENTAGE

  const percentage =

    totalInvestment > 0

      ? (
          (totalProfit /
            totalInvestment) *
          100
        ).toFixed(2)

      : 0;

  const positive =
    totalProfit >= 0;

  return (

    <div className="bg-gradient-to-br from-[#0F172A] to-[#111827] rounded-[28px] p-6 text-white shadow-[0_10px_30px_rgba(15,23,42,0.15)] overflow-hidden relative">

      {/* GLOW */}

      <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-[#10B981] opacity-10 blur-[100px] rounded-full"></div>

      {/* TOP */}

      <div className="flex items-start justify-between relative z-10">

        {/* LEFT */}

        <div>

          <p className="text-[12px] text-[#CBD5E1]">

            Total Portfolio Value

          </p>

          <h1 className="text-[42px] font-bold tracking-tight mt-3">

            ₹
            {currentValue.toLocaleString()}

          </h1>

        </div>

        {/* ICON */}

        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">

          <Wallet size={28} />

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 relative z-10">

        {/* INVESTMENT */}

        <div>

          <p className="text-[11px] text-[#CBD5E1]">

            Investment

          </p>

          <h3 className="text-[20px] font-bold mt-2">

            ₹
            {totalInvestment.toLocaleString()}

          </h3>

        </div>

        {/* PROFIT */}

        <div>

          <p className="text-[11px] text-[#CBD5E1]">

            Total Profit

          </p>

          <h3
            className={`text-[20px] font-bold mt-2 ${
              positive

                ? "text-green-400"

                : "text-red-400"
            }`}
          >

            {positive
              ? "+"
              : "-"}

            ₹
            {Math.abs(
              totalProfit
            ).toLocaleString()}

          </h3>

        </div>

        {/* CHANGE */}

        <div>

          <p className="text-[11px] text-[#CBD5E1]">

            Growth

          </p>

          <div className="flex items-center gap-2 mt-2">

            <TrendingUp
              size={18}
              className={
                positive

                  ? "text-green-400"

                  : "text-red-400"
              }
            />

            <h3
              className={`text-[20px] font-bold ${
                positive

                  ? "text-green-400"

                  : "text-red-400"
              }`}
            >

              {percentage}%

            </h3>

          </div>

        </div>

      </div>

    </div>

  );

};

export default PortfolioHero;