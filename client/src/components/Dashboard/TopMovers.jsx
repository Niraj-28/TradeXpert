import {

  TrendingUp,
  TrendingDown,

} from "lucide-react";

const TopMovers = () => {

  const gainers = [

    {

      symbol: "RELIANCE",

      price: "₹2,985",

      change: "+4.52%",

    },

    {

      symbol: "INFY",

      price: "₹1,620",

      change: "+3.18%",

    },

    {

      symbol: "HDFCBANK",

      price: "₹1,785",

      change: "+2.44%",

    },

  ];

  const losers = [

    {

      symbol: "TCS",

      price: "₹3,850",

      change: "-1.25%",

    },

    {

      symbol: "SBIN",

      price: "₹812",

      change: "-0.92%",

    },

    {

      symbol: "ICICIBANK",

      price: "₹1,120",

      change: "-0.68%",

    },

  ];

  return (

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-5">

      {/* TOP GAINERS */}

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-2">

          <div>
            
            <h2 className="text-xl font-bold text-[#0F172A] mt-2">

              Top Gainers

            </h2>

          </div>

          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">

            <TrendingUp
              className="text-green-600"
              size={18}
            />

          </div>

        </div>

        {/* STOCKS */}

        <div className="space-y-2">

          {gainers.map((stock, index) => (

            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all"
            >

              <div>

                <h3 className="font-semibold text-sm text-[#0F172A]">

                  {stock.symbol}

                </h3>

                <p className="text-[11px] text-[#64748B]">

                  {stock.price}

                </p>

              </div>

              <div className="flex items-center gap-2">

                <div className="px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold text-[11px]">

                  {stock.change}

                </div>

                <button className="px-3 py-1 rounded-lg bg-[#58E6B3] hover:bg-[#4FD1A5] transition-all font-semibold text-[11px] text-[#0F172A]">

                  Buy

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* TOP LOSERS */}

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-2">

          <div>

           <h2 className="text-xl font-bold text-[#0F172A] mt-2">

              Top Losers

            </h2>

          </div>

          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">

            <TrendingDown
              className="text-red-600"
              size={18}
            />

          </div>

        </div>

        {/* STOCKS */}

        <div className="space-y-2">

          {losers.map((stock, index) => (

            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all"
            >

              <div>

                <h3 className="font-semibold text-sm text-[#0F172A]">

                  {stock.symbol}

                </h3>

                <p className="text-[11px] text-[#64748B]">

                  {stock.price}

                </p>

              </div>

              <div className="flex items-center gap-2">

                <div className="px-2 py-1 rounded-lg bg-red-100 text-red-700 font-semibold text-[11px]">

                  {stock.change}

                </div>

                <button className="px-3 py-1 rounded-lg bg-[#F87171] hover:bg-[#EF4444] transition-all font-semibold text-[11px] text-white">

                  Sell

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default TopMovers;