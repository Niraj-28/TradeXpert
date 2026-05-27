import {

  useState,

} from "react";

import {

  Search,
  TrendingUp,
  TrendingDown,
  Trash2,

} from "lucide-react";

const WatchlistPanel = ({

  marketData = [],

}) => {

  const fallbackStocks = [

    {

      symbol: "RELIANCE",

      price: 2985,

      change: 2.45,

    },

    {

      symbol: "TCS",

      price: 3850,

      change: -0.92,

    },

    {

      symbol: "INFY",

      price: 1620,

      change: 1.82,

    },

    {

      symbol: "HDFCBANK",

      price: 1785,

      change: 3.11,

    },

    {

      symbol: "SBIN",

      price: 812,

      change: -1.25,

    },

    {

      symbol: "ICICIBANK",

      price: 1120,

      change: 0.88,

    },

  ];

  const stocks =

    marketData.length > 0

      ? marketData

      : fallbackStocks;

  const [search, setSearch] =
    useState("");

  const [watchlist, setWatchlist] =
    useState([

      "RELIANCE",
      "TCS",
      "INFY",

    ]);

  // FILTER STOCKS

  const filteredStocks =

    stocks.filter((stock) =>

      stock.symbol
        .toLowerCase()
        .includes(

          search.toLowerCase()

        )

    );

  // ADD TO WATCHLIST

  const addToWatchlist = (
    symbol
  ) => {

    if (
      !watchlist.includes(
        symbol
      )
    ) {

      setWatchlist([

        ...watchlist,

        symbol,

      ]);

    }

  };

  // REMOVE

  const removeStock = (
    symbol
  ) => {

    setWatchlist(

      watchlist.filter(

        (item) =>

          item !== symbol

      )

    );

  };

  return (

    <section className="space-y-5">

      {/* SEARCH */}

      <div className="bg-white rounded-[28px] border border-[#E8ECF2] p-5 shadow-[0_4px_18px_rgba(15,23,42,0.05)]">

        <div className="mb-5">

          <h2 className="text-[28px] font-bold tracking-tight text-[#0F172A]">

            Market Watch

          </h2>

          <p className="text-[14px] text-[#64748B] mt-1">

            Search and track stocks

          </p>

        </div>

        {/* SEARCH BAR */}

        <div className="relative">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B]"
          />

          <input
            type="text"
            placeholder="Search stock..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full h-14 pl-14 pr-5 rounded-2xl border border-[#E8ECF2] outline-none focus:border-[#10B981] bg-[#F8FAFC] text-[15px]"
          />

        </div>

        {/* SEARCH RESULTS */}

        {search.length > 0 && (

          <div className="mt-5 space-y-3">

            {filteredStocks.map(
              (stock) => {

                const positive =

                  stock.change >= 0;

                return (

                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-4 rounded-2xl border border-[#EEF2F7]"
                  >

                    <div>

                      <h3 className="text-[15px] font-bold text-[#0F172A]">

                        {stock.symbol}

                      </h3>

                      <p className="text-[13px] text-[#64748B] mt-1">

                        ₹
                        {stock.price}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex items-center gap-1 text-[13px] font-bold ${
                          positive

                            ? "text-green-600"

                            : "text-red-600"
                        }`}
                      >

                        {positive ? (

                          <TrendingUp
                            size={16}
                          />

                        ) : (

                          <TrendingDown
                            size={16}
                          />

                        )}

                        {stock.change}%

                      </div>

                      <button
                        onClick={() =>
                          addToWatchlist(
                            stock.symbol
                          )
                        }
                        className="h-10 px-4 rounded-xl bg-[#0F172A] text-white text-[12px] font-semibold hover:opacity-90"
                      >

                        Add

                      </button>

                    </div>

                  </div>

                );

              }

            )}

          </div>

        )}

      </div>

      {/* WATCHLIST */}

      <div className="bg-white rounded-[28px] border border-[#E8ECF2] p-5 shadow-[0_4px_18px_rgba(15,23,42,0.05)]">

        <div className="mb-5">

          <h2 className="text-[24px] font-bold text-[#0F172A]">

            Watchlist

          </h2>

          <p className="text-[14px] text-[#64748B] mt-1">

            Realtime tracked stocks

          </p>

        </div>

        <div className="space-y-4">

          {watchlist.map(

            (symbol) => {

              const stock =

                stocks.find(

                  (s) =>

                    s.symbol ===
                    symbol

                );

              if (!stock)
                return null;

              const positive =

                stock.change >= 0;

              return (

                <div
                  key={symbol}
                  className="flex items-center justify-between p-5 rounded-2xl border border-[#EEF2F7] hover:bg-[#F8FAFC] transition-all"
                >

                  {/* LEFT */}

                  <div>

                    <h3 className="text-[22px] font-bold text-[#0F172A]">

                      {stock.symbol}

                    </h3>

                    <div
                      className={`mt-2 flex items-center gap-2 text-[14px] font-bold ${
                        positive

                          ? "text-green-600"

                          : "text-red-600"
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

                      {stock.change}%

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="flex items-center gap-5">

                    <div className="text-right">

                      <h2 className="text-[28px] font-bold text-[#0F172A]">

                        ₹
                        {stock.price}
                      </h2>

                      <p className="text-[13px] text-[#64748B] mt-1">

                        Live Price

                      </p>

                    </div>

                    <button
                      onClick={() =>
                        removeStock(
                          stock.symbol
                        )
                      }
                      className="h-12 w-12 rounded-2xl border border-[#EEF2F7] flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
                    >

                      <Trash2
                        size={20}
                      />

                    </button>

                  </div>

                </div>

              );

            }

          )}

        </div>

      </div>

    </section>

  );

};

export default WatchlistPanel;