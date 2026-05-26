import {

  Plus,
  Star,
  TrendingUp,
  TrendingDown,
  Search,

} from "lucide-react";

const WatchlistPanel = () => {

  const watchlist = [

    {

      symbol: "RELIANCE",

      price: "₹2,985",

      change: "+2.45%",

      positive: true,

    },

    {

      symbol: "INFY",

      price: "₹1,620",

      change: "+1.82%",

      positive: true,

    },

    {

      symbol: "TCS",

      price: "₹3,850",

      change: "-0.92%",

      positive: false,

    },

    {

      symbol: "HDFCBANK",

      price: "₹1,785",

      change: "+3.11%",

      positive: true,

    },

    {

      symbol: "SBIN",

      price: "₹812",

      change: "-1.25%",

      positive: false,

    },

  ];

  return (

    <div className="bg-white border border-[#E2E8F0] rounded-[30px] p-6 shadow-sm mt-5">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-3">

        <div>

          <h2 className="text-xl font-bold text-[#0F172A] mt-1">

            Watchlist

          </h2>

        </div>

        <button className="w-8 h-8 rounded-2xl bg-[#58E6B3] hover:bg-[#4FD1A5] transition-all flex items-center justify-center">

          <Plus
            className="text-[#0F172A]"
            size={24}
          />

        </button>

      </div>

      {/* SEARCH */}

      <div className="relative mb-3">

        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
        />

        <input
          type="text"
          placeholder="Search Stocks..."
          className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-12 pr-4 outline-none focus:border-[#58E6B3]"
        />

      </div>

      {/* WATCHLIST ITEMS */}

      <div className="space-y-4">

        {watchlist.map((stock, index) => (

          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all"
          >

            {/* LEFT */}

            <div className="flex items-center gap-4">

              <div className="w-8 h-8 rounded-2xl bg-white flex items-center justify-center border border-[#E2E8F0]">

                <Star
                  size={18}
                  className={`${
                    stock.positive

                      ? "text-green-500"

                      : "text-red-500"

                  }`}
                />

              </div>

              <div>

                <h3 className="font-bold text-[#0F172A] text-sm">

                  {stock.symbol}

                </h3>

                <p className="text-xs text-[#64748B]">

                  {stock.price}

                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="text-right">

              <div
                className={`flex items-center justify-end text-sm gap-1 font-semibold ${
                  stock.positive

                    ? "text-green-600"

                    : "text-red-600"

                }`}
              >

                {stock.positive ? (

                  <TrendingUp size={12} />

                ) : (

                  <TrendingDown size={12} />

                )}

                {stock.change}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default WatchlistPanel;