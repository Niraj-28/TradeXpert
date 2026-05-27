import {

  TrendingUp,
  TrendingDown,

} from "lucide-react";

const MarketCards = ({

  marketData = [],

}) => {

  const fallbackStocks = [

    {

      symbol: "RELIANCE",

      price: 2985,

      change: 2.45,

      high: 3010,

      low: 2960,

      volume: "12.4M",

    },

    {

      symbol: "TCS",

      price: 3850,

      change: -0.92,

      high: 3895,

      low: 3810,

      volume: "5.2M",

    },

    {

      symbol: "INFY",

      price: 1620,

      change: 1.82,

      high: 1638,

      low: 1604,

      volume: "8.1M",

    },

    {

      symbol: "HDFCBANK",

      price: 1785,

      change: 3.11,

      high: 1802,

      low: 1760,

      volume: "7.6M",

    },

    {

      symbol: "ICICIBANK",

      price: 1120,

      change: 0.88,

      high: 1135,

      low: 1108,

      volume: "6.9M",

    },

    {

      symbol: "SBIN",

      price: 812,

      change: -1.25,

      high: 826,

      low: 805,

      volume: "9.4M",

    },

  ];

  const stocks =

    marketData.length > 0

      ? marketData

      : fallbackStocks;

  return (

    <section>

      {/* HEADER */}

      <div className="mb-5">

        <h2 className="text-[28px] font-bold tracking-tight text-[#0F172A]">

          Live Market

        </h2>

        <p className="text-[14px] text-[#64748B] mt-1">

          Realtime NSE stock updates

        </p>

      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {stocks.map((stock) => {

          const positive =

            Number(stock.change) >=
            0;

          return (

            <div
              key={stock.symbol}
              className="group relative overflow-hidden bg-white rounded-[28px] border border-[#E8ECF2] p-5 shadow-[0_4px_18px_rgba(15,23,42,0.05)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.10)] transition-all duration-300"
            >

              {/* TOP GLOW */}

              <div
                className={`absolute top-0 left-0 h-1 w-full ${
                  positive

                    ? "bg-green-500"

                    : "bg-red-500"
                }`}
              />

              {/* HEADER */}

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-[22px] font-bold tracking-tight text-[#0F172A]">

                    {stock.symbol}

                  </h2>

                  <p className="text-[12px] text-[#64748B] mt-1">

                    NSE Market

                  </p>

                </div>

                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                    positive

                      ? "bg-green-100 text-green-600"

                      : "bg-red-100 text-red-600"
                  }`}
                >

                  {positive ? (

                    <TrendingUp
                      size={20}
                    />

                  ) : (

                    <TrendingDown
                      size={20}
                    />

                  )}

                </div>

              </div>

              {/* PRICE */}

              <div className="mt-7">

                <h1 className="text-[40px] font-bold tracking-tight text-[#0F172A]">

                  ₹
                  {stock.price}
                </h1>

              </div>

              {/* CHANGE */}

              <div className="mt-4 flex items-center gap-3">

                <div
                  className={`px-4 py-2 rounded-2xl text-[13px] font-bold ${
                    positive

                      ? "bg-green-100 text-green-700"

                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {positive
                    ? "+"
                    : ""}
                  {stock.change}%

                </div>

                <p className="text-[12px] text-[#64748B]">

                  Today

                </p>

              </div>

              {/* DETAILS */}

              <div className="mt-7 grid grid-cols-3 gap-4">

                <div>

                  <p className="text-[11px] text-[#64748B]">

                    High

                  </p>

                  <h4 className="mt-1 text-[14px] font-bold text-green-600">

                    ₹
                    {stock.high}
                  </h4>

                </div>

                <div>

                  <p className="text-[11px] text-[#64748B]">

                    Low

                  </p>

                  <h4 className="mt-1 text-[14px] font-bold text-red-600">

                    ₹
                    {stock.low}
                  </h4>

                </div>

                <div>

                  <p className="text-[11px] text-[#64748B]">

                    Volume

                  </p>

                  <h4 className="mt-1 text-[14px] font-bold text-[#0F172A]">

                    {stock.volume}
                  </h4>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-7 flex items-center gap-3">

                <button className="flex-1 h-11 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-[13px] font-bold transition-all">

                  Buy

                </button>

                <button className="flex-1 h-11 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold transition-all">

                  Sell

                </button>

              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

};

export default MarketCards;