import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";

import {

  Wallet,
  TrendingUp,
  BarChart3,

} from "lucide-react";

import {

  getPortfolio,

} from "../../services/tradeService";

const Portfolio = () => {

  const [portfolio, setPortfolio] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchPortfolio();

  }, []);

  const fetchPortfolio = async () => {

    try {

      const data = await getPortfolio();

      setPortfolio(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };


  // TOTAL VALUE

  const totalInvested = portfolio.reduce(

    (acc, item) =>

      acc + item.investedAmount,

    0

  );

  const totalCurrent = portfolio.reduce(

    (acc, item) =>

      acc +

      item.quantity *

      (item.averagePrice * 1.08),

    0

  );

  const totalProfit =

    totalCurrent - totalInvested;

  return (

    <div className="min-h-screen bg-[#F8FAFC]">

      <Navbar />

      <div className="pt-24 px-5 lg:px-10 pb-10">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-[#0F172A]">

            Portfolio

          </h1>

          <p className="text-[#64748B] mt-2">

            Track your holdings and investments

          </p>

        </div>


        {/* STATS */}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* INVESTED */}

          <div className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] flex items-center justify-center">

                <Wallet
                  className="text-[#16A34A]"
                  size={22}
                />

              </div>

            </div>

            <p className="text-[#64748B] text-sm mb-2">

              Total Invested

            </p>

            <h1 className="text-4xl font-bold text-[#0F172A]">

              ₹{totalInvested.toFixed(2)}

            </h1>

          </div>


          {/* CURRENT VALUE */}

          <div className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">

                <BarChart3
                  className="text-[#4F46E5]"
                  size={22}
                />

              </div>

            </div>

            <p className="text-[#64748B] text-sm mb-2">

              Current Value

            </p>

            <h1 className="text-4xl font-bold text-[#0F172A]">

              ₹{totalCurrent.toFixed(2)}

            </h1>

          </div>


          {/* PROFIT */}

          <div className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center">

                <TrendingUp
                  className="text-[#D97706]"
                  size={22}
                />

              </div>

            </div>

            <p className="text-[#64748B] text-sm mb-2">

              Total Profit

            </p>

            <h1
              className={`text-4xl font-bold ${
                totalProfit >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >

              ₹{totalProfit.toFixed(2)}

            </h1>

          </div>

        </div>


        {/* HOLDINGS */}

        <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden">

          {/* TABLE HEADER */}

          <div className="grid grid-cols-6 gap-4 px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC] font-semibold text-[#64748B] text-sm">

            <div>Stock</div>

            <div>Quantity</div>

            <div>Avg Price</div>

            <div>Invested</div>

            <div>Current</div>

            <div>P/L</div>

          </div>


          {/* TABLE BODY */}

          {loading ? (

            <div className="p-10 text-center text-[#64748B]">

              Loading Portfolio...

            </div>

          ) : portfolio.length === 0 ? (

            <div className="p-10 text-center text-[#64748B]">

              No Holdings Found

            </div>

          ) : (

            portfolio.map((item, index) => {

              const currentPrice =

                item.averagePrice * 1.08;

              const currentValue =

                currentPrice *

                item.quantity;

              const profit =

                currentValue -

                item.investedAmount;

              return (

                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 px-6 py-5 border-b border-[#F1F5F9] items-center hover:bg-[#FAFAFA] transition-all"
                >

                  {/* STOCK */}

                  <div>

                    <h2 className="font-bold text-[#0F172A]">

                      {item.stockName}

                    </h2>

                    <p className="text-sm text-[#94A3B8]">

                      {item.stockSymbol}

                    </p>

                  </div>


                  {/* QTY */}

                  <div className="font-semibold">

                    {item.quantity}

                  </div>


                  {/* AVG */}

                  <div>

                    ₹{item.averagePrice.toFixed(2)}

                  </div>


                  {/* INVESTED */}

                  <div>

                    ₹{item.investedAmount.toFixed(2)}

                  </div>


                  {/* CURRENT */}

                  <div className="font-semibold text-[#0F172A]">

                    ₹{currentValue.toFixed(2)}

                  </div>


                  {/* PROFIT */}

                  <div
                    className={`font-bold ${
                      profit >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >

                    ₹{profit.toFixed(2)}

                  </div>

                </div>

              );

            })

          )}

        </div>

      </div>

    </div>

  );

};

export default Portfolio;