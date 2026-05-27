import { useEffect, useState } from "react";

import TradingChart from "../../components/Dashboard/TradingChart";

import TradingPanel from "../../components/Dashboard/TradingPanel";

import OrderBook from "../../components/Dashboard/OrderBook";

import socket from "../../socket/socket";

const Trading = () => {

  const [marketData, setMarketData] =
    useState([]);

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

  return (

    <div className="min-h-screen bg-[#F4F7FB] px-5 lg:px-8 py-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <p className="text-[14px] text-[#64748B] font-medium">

            Professional Trading Terminal

          </p>

          <h1 className="mt-2 text-[42px] font-bold tracking-tight text-[#0F172A]">

            Trading

          </h1>

        </div>

        {/* MARKET STATUS */}

        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-green-100 text-green-700 w-fit">

          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />

          <span className="text-[14px] font-bold">

            Market Live

          </span>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">

        {/* LEFT */}

        <div className="2xl:col-span-8 space-y-6">

          {/* CHART */}

          <TradingChart
            marketData={marketData}
          />

          {/* ORDER BOOK */}

          <OrderBook />

        </div>

        {/* RIGHT */}

        <div className="2xl:col-span-4">

          <TradingPanel
            marketData={marketData}
          />

        </div>

      </div>

    </div>

  );

};

export default Trading;