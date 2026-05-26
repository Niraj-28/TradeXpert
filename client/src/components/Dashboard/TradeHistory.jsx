import {

  useEffect,
  useState,

} from "react";

import toast from "react-hot-toast";

import {

  TrendingUp,
  TrendingDown,

} from "lucide-react";

import {

  getTradeHistory,

} from "../../services/tradeService";

const TradeHistory = () => {

  const [trades, setTrades] =

    useState([]);

  const [loading, setLoading] =

    useState(true);

  useEffect(() => {

    fetchTrades();

  }, []);

  const fetchTrades = async () => {

    try {

      const token = localStorage.getItem(

        "token"

      );

      const data = await getTradeHistory(

        token

      );

      setTrades(data.trades);

    } catch (error) {

      toast.error(

        "Failed to load trades"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="bg-white border border-[#E2E8F0] rounded-[30px] p-6 shadow-sm mt-5">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-2">

        <div>

          <h2 className="text-xl font-bold text-[#0F172A] mt-2">

            Trade History

          </h2>

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[800px]">

          <thead>

            <tr className="border-b border-[#E2E8F0]">

              <th className="text-left py-4 text-xs font-semibold text-[#64748B]">

                Symbol

              </th>

              <th className="text-left py-4 text-xs font-semibold text-[#64748B]">

                Type

              </th>

              <th className="text-left py-4 text-xs font-semibold text-[#64748B]">

                Quantity

              </th>

              <th className="text-left py-4 text-xs font-semibold text-[#64748B]">

                Price

              </th>

              <th className="text-left py-4 text-xs font-semibold text-[#64748B]">

                Total

              </th>

              <th className="text-left py-4 text-xs font-semibold text-[#64748B]">

                Date

              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="6"
                  className="py-10 text-center text-[#64748B]"
                >

                  Loading trades...

                </td>

              </tr>

            ) : trades.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="py-10 text-center text-[#64748B]"
                >

                  No trades found

                </td>

              </tr>

            ) : (

              trades.map((trade) => (

                <tr
                  key={trade._id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-all"
                >

                  {/* SYMBOL */}

                  <td className="py-5 text-sm">

                    <div>

                      <h3 className="font-bold text-[#0F172A] ">

                        {trade.symbol}

                      </h3>

                      <p className="text-sm text-[#64748B] text-xs">

                        NSE Equity

                      </p>

                    </div>

                  </td>

                  {/* TYPE */}

                  <td className="py-5 text-sm">

                    <div
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                        trade.type === "BUY"

                          ? "bg-green-100 text-green-700"

                          : "bg-red-100 text-red-700"

                      }`}
                    >

                      {trade.type === "BUY" ? (

                        <TrendingUp size={16} />

                      ) : (

                        <TrendingDown size={16} />

                      )}

                      {trade.type}

                    </div>

                  </td>

                  {/* QUANTITY */}

                  <td className="py-5 font-semibold text-[#0F172A] text-sm">

                    {trade.quantity}

                  </td>

                  {/* PRICE */}

                  <td className="py-5 font-semibold text-[#0F172A] text-sm">

                    ₹{trade.price}

                  </td>

                  {/* TOTAL */}

                  <td className="py-5 font-bold text-[#0F172A] text-sm">

                    ₹{trade.total}

                  </td>

                  {/* DATE */}

                  <td className="py-5 text-[#64748B] text-sm">

                    {new Date(

                      trade.createdAt

                    ).toLocaleString()}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default TradeHistory;