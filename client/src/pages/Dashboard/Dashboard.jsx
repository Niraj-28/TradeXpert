import { useEffect, useState } from "react";

import LiveTicker from "../../components/Dashboard/LiveTicker";
import MarketIndices from "../../components/Dashboard/MarketIndices";
import MarketCards from "../../components/Dashboard/MarketCards";

import TopMovers from "../../components/Dashboard/TopMovers";
import TradingChart from "../../components/Dashboard/TradingChart";

import Holdings from "../../components/Dashboard/Holdings";
import TradeHistory from "../../components/Dashboard/TradeHistory";

import TradingPanel from "../../components/Dashboard/TradingPanel";
import OrderBook from "../../components/Dashboard/OrderBook";

import WatchlistPanel from "../../components/Dashboard/WatchlistPanel";

import socket from "../../socket/socket";

const Dashboard = () => {

  const [marketData, setMarketData] =
    useState([]);

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

  const safeMarketData =

    Array.isArray(marketData)

      ? marketData

      : [];

  return (

    <div className="min-h-screen bg-[#F4F7FB]">

      {/* MAIN */}

      <main className="px-5 lg:px-8 py-5 space-y-5">

        {/* LIVE TICKER */}

        <LiveTicker
          marketData={
            safeMarketData
          }
        />

        {/* MARKET INDICES */}

        <MarketIndices
          marketData={
            safeMarketData
          }
        />

        {/* MAIN GRID */}

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">

          {/* LEFT SIDE */}

          <div className="xl:col-span-8 space-y-5">

            {/* LIVE MARKET */}

            <MarketCards
              marketData={
                safeMarketData
              }
            />

            {/* WATCHLIST + MOVERS */}

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">

              <WatchlistPanel
                marketData={
                  safeMarketData
                }
              />

              <TopMovers
                marketData={
                  safeMarketData
                }
              />

            </div>

            {/* CHART */}

            <TradingChart
              marketData={
                safeMarketData
              }
            />

            {/* HOLDINGS */}

            <Holdings />

            {/* TRADE HISTORY */}

            <TradeHistory />

          </div>

          {/* RIGHT SIDE */}

          <div className="xl:col-span-4 space-y-5">

            {/* TERMINAL */}

            <TradingPanel
              marketData={
                safeMarketData
              }
            />

            {/* ORDER BOOK */}

            <OrderBook />

          </div>

        </section>

      </main>

    </div>

  );

};

export default Dashboard;