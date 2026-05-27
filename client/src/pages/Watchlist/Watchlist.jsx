import { useEffect, useState } from "react";

import {
  Search,
  TrendingUp,
  TrendingDown,
  Trash2,
} from "lucide-react";

import socket from "../../socket/socket";

const Watchlist = () => {

  const [marketData, setMarketData] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [watchlist, setWatchlist] =
    useState([

      "RELIANCE",
      "TCS",
      "INFY",
      "HDFCBANK",

    ]);

  // SOCKET

  useEffect(() => {

    socket.connect();

    socket.on(
      "marketData",
      (data) => {

        if (
          Array.isArray(data)
        ) {

          setMarketData(data);

        }

      }
    );

    return () => {

      socket.off(
        "marketData"
      );

    };

  }, []);

  // FILTER STOCKS

  const filteredStocks =

    marketData.filter((stock) =>

      stock.symbol
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  // ADD STOCK

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

  // REMOVE STOCK

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

    <div className="min-h-screen bg-[#F4F7FB] px-5 lg:px-8 py-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <p className="text-[14px] text-[#64748B] font-medium">

            Realtime Market Tracking

          </p>

          <h1 className="mt-2 text-[42px] font-bold tracking-tight text-[#0F172A]">

            Watchlist

          </h1>

        </div>

        {/* SEARCH */}

        <div className="relative w-full lg:w-[420px]">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B]"
          />

          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full h-14 pl-14 pr-5 rounded-2xl border border-[#E8ECF2] bg-white outline-none focus:border-[#10B981]"
          />

        </div>

      </div>

      {/* SEARCH RESULTS */}

      {search.length > 0 && (

        <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 mb-8 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

          <h2 className="text-[26px] font-bold tracking-tight text-[#0F172A]">

            Search Results

          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {filteredStocks.map((stock) => {

              const positive =

                stock.change >= 0;

              return (

                <div
                  key={stock.symbol}
                  className="rounded-[24px] border border-[#EEF2F7] p-5 hover:bg-[#FAFBFC] transition-all"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <h3 className="text-[24px] font-bold tracking-tight text-[#0F172A]">

                        {stock.symbol}

                      </h3>

                      <p className="mt-1 text-[13px] text-[#64748B]">

                        NSE Market

                      </p>

                    </div>

                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[13px] font-bold ${
                        positive

                          ? "bg-green-100 text-green-700"

                          : "bg-red-100 text-red-700"
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

                  </div>

                  <div className="mt-6">

                    <h1 className="text-[42px] font-bold tracking-tight text-[#0F172A]">

                      ₹
                      {stock.price}

                    </h1>

                  </div>

                  <button
                    onClick={() =>
                      addToWatchlist(
                        stock.symbol
                      )
                    }
                    className="mt-6 w-full h-12 rounded-2xl bg-[#0F172A] text-white text-[14px] font-bold hover:opacity-90 transition-all"
                  >

                    Add to Watchlist

                  </button>

                </div>

              );

            })}

          </div>

        </div>

      )}

      {/* WATCHLIST */}

      <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

        <div className="flex items-center justify-between mb-8">

          <div>

            <p className="text-[13px] text-[#64748B] font-medium">

              Your Market Tracking

            </p>

            <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

              My Watchlist

            </h2>

          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-100 text-green-700">

            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />

            <span className="text-[13px] font-bold">

              Live

            </span>

          </div>

        </div>

        {/* LIST */}

        <div className="space-y-5">

          {watchlist.map((symbol) => {

            const stock =
              marketData.find(
                (item) =>

                  item.symbol ===
                  symbol
              );

            if (!stock)
              return null;

            const positive =

              stock.change >= 0;

            return (

              <div
                key={symbol}
                className="rounded-[24px] border border-[#EEF2F7] p-5 hover:bg-[#FAFBFC] transition-all"
              >

                <div className="flex items-center justify-between">

                  {/* LEFT */}

                  <div>

                    <h3 className="text-[28px] font-bold tracking-tight text-[#0F172A]">

                      {stock.symbol}

                    </h3>

                    <div
                      className={`mt-3 flex items-center gap-2 text-[14px] font-bold ${
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

                  {/* CENTER */}

                  <div className="text-center">

                    <p className="text-[13px] text-[#64748B]">

                      Live Price

                    </p>

                    <h2 className="mt-2 text-[38px] font-bold tracking-tight text-[#0F172A]">

                      ₹
                      {stock.price}

                    </h2>

                  </div>

                  {/* RIGHT */}

                  <div className="flex items-center gap-3">

                    <button className="h-12 px-6 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-[13px] font-bold transition-all">

                      Buy

                    </button>

                    <button className="h-12 px-6 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold transition-all">

                      Sell

                    </button>

                    <button
                      onClick={() =>
                        removeStock(
                          symbol
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

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

};

export default Watchlist;