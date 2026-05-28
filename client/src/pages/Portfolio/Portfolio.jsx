import { useEffect, useState } from "react";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
} from "lucide-react";

import Holdings from "../../components/Dashboard/Holdings";

import {
  getHoldings,
} from "../../services/holdingService";

import { useMarket } from "../../context/MarketContext";

const Portfolio = () => {

  const [holdings, setHoldings] =
    useState([]);

  const { marketData } =
    useMarket();

  // FETCH HOLDINGS

  useEffect(() => {

    fetchHoldings();

  }, []);

  const fetchHoldings =
    async () => {

      try {

        const data =
          await getHoldings();

        setHoldings(
          data.holdings || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  // MAP

  const marketMap =

    marketData.reduce(
      (acc, stock) => {

        acc[stock.symbol] =
          stock;

        return acc;

      },
      {}
    );

  // LIVE HOLDINGS

  const liveHoldings =
    holdings.map((item) => {

      const live =
        marketMap[
          item.symbol
        ] || {};

      return {

        ...item,

        currentPrice:
          Number(
            live.price || 0
          ),

      };

    });

  // TOTALS

  const totalInvestment =

    liveHoldings.reduce(

      (acc, item) =>

        acc +

        item.avgPrice *
          item.quantity,

      0

    );

  const currentValue =

    liveHoldings.reduce(

      (acc, item) =>

        acc +

        item.currentPrice *
          item.quantity,

      0

    );

  const totalPnL =

    currentValue -
    totalInvestment;

  const positive =
    totalPnL >= 0;

  return (

    <div className="min-h-screen bg-[#F4F7FB] px-5 lg:px-8 py-6">

      <div className="flex items-center justify-between mb-8">

        <div>

          <p className="text-[14px] text-[#64748B] font-medium">

            Investment Overview

          </p>

          <h1 className="mt-2 text-[42px] font-bold tracking-tight text-[#0F172A]">

            Portfolio

          </h1>

        </div>

      </div>

      {/* STATS */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[13px] text-[#64748B]">

                Current Value

              </p>

              <h2 className="mt-3 text-[38px] font-bold">

                ₹
                {currentValue.toFixed(
                  2
                )}

              </h2>

            </div>

            <div className="h-14 w-14 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center">

              <Wallet size={24} />

            </div>

          </div>

        </div>

      </section>

      <Holdings
        holdings={liveHoldings}
      />

    </div>

  );

};

export default Portfolio;