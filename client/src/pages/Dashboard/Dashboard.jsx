import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";

import socket from "../../socket/socket";

const Dashboard = () => {

  const [marketData, setMarketData] = useState({});

  useEffect(() => {

    socket.on(

      "marketData",

      (data) => {

        setMarketData(data);

      }

    );

    return () => {

      socket.off("marketData");

    };

  }, []);

  const stocks = Object.values(

    marketData || {}

  );

  return (

    <div className="min-h-screen bg-[#F8FAFC]">

      <Navbar />

      <div className="p-6 md:p-10">

        {/* PAGE TITLE */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-[#0F172A]">

            Live Market Dashboard

          </h1>

          <p className="text-gray-500 mt-2">

            Real-time stock prices powered by Upstox

          </p>

        </div>

        {/* LIVE STOCK GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {stocks.map((stock, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm"
            >

              {/* STOCK NAME */}

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-xl font-bold text-[#0F172A]">

                  {stock.symbol}

                </h2>

                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

              </div>

              {/* LIVE PRICE */}

              <h1 className="text-4xl font-bold text-[#0F172A] mb-3">

                ₹{stock.last_price}

              </h1>

              {/* CHANGE */}

              <div
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                  stock.net_change >= 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >

                {stock.net_change >= 0 ? "+" : ""}

                {stock.net_change}

              </div>

              {/* EXTRA DATA */}

              <div className="mt-6 space-y-3 text-sm">

                <div className="flex justify-between">

                  <span className="text-gray-500">

                    Open

                  </span>

                  <span className="font-semibold">

                    ₹{stock.ohlc?.open}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">

                    High

                  </span>

                  <span className="font-semibold text-green-600">

                    ₹{stock.ohlc?.high}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">

                    Low

                  </span>

                  <span className="font-semibold text-red-600">

                    ₹{stock.ohlc?.low}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">

                    Close

                  </span>

                  <span className="font-semibold">

                    ₹{stock.ohlc?.close}

                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default Dashboard;