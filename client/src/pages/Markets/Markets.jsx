import { useEffect, useState } from "react";

import {
  Search,
  TrendingUp,
  TrendingDown,
  Flame,
} from "lucide-react";

import socket from "../../socket/socket";

const Markets = () => {

  const [marketData, setMarketData] =
    useState([]);

  const [search, setSearch] =
    useState("");

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

  // FILTER

  const filteredStocks =

    marketData.filter((stock) =>

      stock.symbol
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  // TOP GAINERS

  const topGainers =

    [...marketData]

      .sort(
        (a, b) =>

          b.change -
          a.change
      )

      .slice(0, 5);

  // TOP LOSERS

  const topLosers =

    [...marketData]

      .sort(
        (a, b) =>

          a.change -
          b.change
      )

      .slice(0, 5);

  const indices = [

    {
      name: "NIFTY 50",
      value: "24,850.25",
      change: "+0.61%",
      positive: true,
    },

    {
      name: "SENSEX",
      value: "81,320.45",
      change: "+0.51%",
      positive: true,
    },

    {
      name: "BANKNIFTY",
      value: "52,610.20",
      change: "-0.22%",
      positive: false,
    },

  ];

  return (

    <div className="min-h-screen bg-[#F4F7FB] px-5 lg:px-8 py-6">

      {/* PAGE HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <p className="text-[14px] text-[#64748B] font-medium">

            Market Overview

          </p>

          <h1 className="mt-2 text-[42px] font-bold tracking-tight text-[#0F172A]">

            Markets

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

      {/* INDICES */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {indices.map((item) => (

          <div
            key={item.name}
            className="bg-white rounded-[28px] border border-[#E8ECF2] p-6 shadow-[0_4px_18px_rgba(15,23,42,0.05)]"
          >

            <p className="text-[13px] text-[#64748B]">

              Market Index

            </p>

            <h2 className="mt-3 text-[30px] font-bold tracking-tight text-[#0F172A]">

              {item.name}

            </h2>

            <div className="mt-5 flex items-center justify-between">

              <h3 className="text-[28px] font-bold text-[#0F172A]">

                {item.value}

              </h3>

              <div
                className={`px-4 py-2 rounded-2xl text-[13px] font-bold ${
                  item.positive

                    ? "bg-green-100 text-green-700"

                    : "bg-red-100 text-red-700"
                }`}
              >

                {item.change}

              </div>

            </div>

          </div>

        ))}

      </section>

      {/* MAIN GRID */}

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* STOCKS */}

        <div className="xl:col-span-8">

          <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-8">

              <div>

                <p className="text-[13px] text-[#64748B] font-medium">

                  Live Market

                </p>

                <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

                  Stocks

                </h2>

              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-100 text-green-700">

                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />

                <span className="text-[13px] font-bold">

                  Live

                </span>

              </div>

            </div>

            {/* GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {filteredStocks.map((stock) => {

                const positive =

                  stock.change >= 0;

                return (

                  <div
                    key={stock.symbol}
                    className="rounded-[24px] border border-[#EEF2F7] p-5 hover:bg-[#FAFBFC] transition-all"
                  >

                    <div className="flex items-start justify-between">

                      {/* LEFT */}

                      <div>

                        <h3 className="text-[24px] font-bold tracking-tight text-[#0F172A]">

                          {stock.symbol}

                        </h3>

                        <p className="mt-1 text-[13px] text-[#64748B]">

                          NSE Market

                        </p>

                      </div>

                      {/* CHANGE */}

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

                    {/* PRICE */}

                    <div className="mt-6">

                      <h1 className="text-[42px] font-bold tracking-tight text-[#0F172A]">

                        ₹
                        {stock.price}

                      </h1>

                    </div>

                    {/* BUTTONS */}

                    <div className="mt-6 flex items-center gap-3">

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

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="xl:col-span-4 space-y-6">

          {/* GAINERS */}

          <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

            <div className="flex items-center gap-3">

              <Flame className="text-orange-500" />

              <h2 className="text-[26px] font-bold tracking-tight text-[#0F172A]">

                Top Gainers

              </h2>

            </div>

            <div className="mt-6 space-y-4">

              {topGainers.map((stock) => (

                <div
                  key={stock.symbol}
                  className="flex items-center justify-between"
                >

                  <div>

                    <h3 className="text-[18px] font-bold text-[#0F172A]">

                      {stock.symbol}

                    </h3>

                    <p className="text-[13px] text-[#64748B]">

                      ₹
                      {stock.price}

                    </p>

                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-green-100 text-green-700 text-[13px] font-bold">

                    +{stock.change}%

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* LOSERS */}

          <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

            <div className="flex items-center gap-3">

              <TrendingDown className="text-red-500" />

              <h2 className="text-[26px] font-bold tracking-tight text-[#0F172A]">

                Top Losers

              </h2>

            </div>

            <div className="mt-6 space-y-4">

              {topLosers.map((stock) => (

                <div
                  key={stock.symbol}
                  className="flex items-center justify-between"
                >

                  <div>

                    <h3 className="text-[18px] font-bold text-[#0F172A]">

                      {stock.symbol}

                    </h3>

                    <p className="text-[13px] text-[#64748B]">

                      ₹
                      {stock.price}

                    </p>

                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-red-100 text-red-700 text-[13px] font-bold">

                    {stock.change}%

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

    </div>

  );

};

export default Markets;