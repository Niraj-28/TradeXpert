import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";

import socket from "../../socket/socket";

import LiveTicker from "../../components/Dashboard/LiveTicker";

import MarketOverview from "../../components/Dashboard/MarketOverview";

import TopMovers from "../../components/Dashboard/TopMovers";

import TradingChart from "../../components/Dashboard/TradingChart";

import WatchlistPanel from "../../components/Dashboard/WatchlistPanel";

import PortfolioAnalytics from "../../components/Dashboard/PortfolioAnalytics";

import TradingPanel from "../../components/Dashboard/TradingPanel";

import TradeHistory from "../../components/Dashboard/TradeHistory";

import PortfolioSummary from "../../components/Dashboard/PortfolioSummary";

import Holdings from "../../components/Dashboard/Holdings";

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

    <div className="min-h-screen bg-[#F4F7FB]">

      {/* NAVBAR */}

      <Navbar />

      {/* MAIN */}

      <main className="max-w-[1600px] mx-auto px-4 md:px-5 xl:px-6 py-3">

        

        {/* TICKER */}

        <LiveTicker />

        {/* MARKET + PORTFOLIO */}

        <section className="mt-3 space-y-2">

          <MarketOverview />

          {/* LIVE STOCKS */}

        <section className="mt-5">

          <div className="grid grid-cols-1 sm:grid-cols-6 xl:grid-cols-3 2xl:grid-cols-4 gap-2">

            {stocks.map((stock, index) => (

              <div
                key={index}
                className="bg-white rounded-[14px] p-3 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300"
              >

                {/* TOP */}

                <div className="flex items-start justify-between mb-2">

                  <div>

                    <h2 className="text-[12px] font-bold text-[#0F172A]">

                      {stock.symbol || "STOCK"}

                    </h2>

                    <p className="text-[10px] text-[#64748B] mt-0.5">

                      NSE Market

                    </p>

                  </div>

                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>

                </div>

                {/* PRICE */}

                <h1 className="text-[18px] font-bold tracking-tight text-[#0F172A] mb-2">

                  ₹{stock.last_price || "--"}

                </h1>

                {/* CHANGE */}

                <div
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                    stock.net_change >= 0

                      ? "bg-green-100 text-green-700"

                      : "bg-red-100 text-red-700"

                  }`}
                >

                  {stock.net_change >= 0 ? "+" : ""}

                  {stock.net_change || 0}

                </div>

                {/* STATS */}

                <div className="mt-2 space-y-1.5">

                  <div className="flex items-center justify-between text-[10px]">

                    <span className="text-[#64748B]">

                      Open

                    </span>

                    <span className="font-semibold text-[10px] text-[#0F172A]">

                      ₹{stock.ohlc?.open || "--"}

                    </span>

                  </div>

                  <div className="flex items-center justify-between text-[10px]">

                    <span className="text-[#64748B]">

                      High

                    </span>

                    <span className="font-semibold text-[10px] text-green-600">

                      ₹{stock.ohlc?.high || "--"}

                    </span>

                  </div>

                  <div className="flex items-center justify-between text-[10px]">

                    <span className="text-[#64748B]">

                      Low

                    </span>

                    <span className="font-semibold text-[10px] text-red-600">

                      ₹{stock.ohlc?.low || "--"}

                    </span>

                  </div>

                  <div className="flex items-center justify-between text-[10px]">

                    <span className="text-[#64748B]">

                      Close

                    </span>

                    <span className="font-semibold text-[10px] text-[#0F172A]">

                      ₹{stock.ohlc?.close || "--"}

                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>


          <PortfolioSummary />

        </section>

        {/* MAIN GRID */}

        {/* HOLDINGS + TRADE HISTORY */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">

          <Holdings />

          <TradeHistory />

        </section>

        {/* TOP MOVERS */}

        <section className="mt-3">

          <TopMovers />

        </section>

        {/* PORTFOLIO GROWTH + PORTFOLIO ALLOCATION */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">

          <TradingChart />

          <PortfolioAnalytics />

        </section>

        {/* WATCHLIST */}

        <section className="mt-3">

          <WatchlistPanel />

        </section>

        
        {/* TRADING PANEL */}

        <section className="mt-2 pb-4">

          <TradingPanel />

        </section>

      </main>

    </div>

  );

};

export default Dashboard;