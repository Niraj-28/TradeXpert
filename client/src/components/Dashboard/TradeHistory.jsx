import {

  useEffect,
  useState,

} from "react";

import {

  ArrowUp,
  ArrowDown,
  Clock3,

} from "lucide-react";

import {

  getOrders,

} from "../../services/orderService";

const TradeHistory = () => {

  const [trades, setTrades] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH TRADES

  const fetchTrades =
    async () => {

      try {

        const data =
          await getOrders();

        const executedTrades =

          (data.orders || []).filter(

            (trade) =>

              trade.status ===
              "EXECUTED"

          );

        setTrades(
          executedTrades
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // AUTO REFRESH

  useEffect(() => {

    fetchTrades();

    const interval =
      setInterval(() => {

        fetchTrades();

      }, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[13px] text-[#64748B] font-medium">

            Trading Activity

          </p>

          <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

            Trade History

          </h2>

        </div>

        <div className="h-12 w-12 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center">

          <Clock3 size={22} />

        </div>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="py-14 text-center">

          <p className="text-[14px] text-[#64748B]">

            Loading trades...

          </p>

        </div>

      )}

      {/* EMPTY */}

      {!loading &&
        trades.length === 0 && (

          <div className="py-14 text-center">

            <p className="text-[14px] text-[#64748B]">

              No executed trades

            </p>

          </div>

        )}

      {/* TRADE LIST */}

      {trades.length > 0 && (

        <div className="mt-8 space-y-5">

          {trades.map((trade) => {

            const buy =
              trade.type ===
              "BUY";

            const totalValue =

              (
                trade.price *

                trade.quantity
              ).toFixed(2);

            return (

              <div
                key={trade._id}
                className="relative rounded-[26px] border border-[#EEF2F7] p-5 hover:bg-[#FAFBFC] transition-all"
              >

                {/* TIMELINE DOT */}

                <div
                  className={`absolute left-[-8px] top-8 h-4 w-4 rounded-full border-4 border-white ${
                    buy

                      ? "bg-green-500"

                      : "bg-red-500"
                  }`}
                />

                {/* CONTENT */}

                <div className="flex items-start justify-between">

                  {/* LEFT */}

                  <div className="flex items-start gap-4">

                    {/* ICON */}

                    <div
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                        buy

                          ? "bg-green-100 text-green-600"

                          : "bg-red-100 text-red-600"
                      }`}
                    >

                      {buy ? (

                        <ArrowUp
                          size={24}
                        />

                      ) : (

                        <ArrowDown
                          size={24}
                        />

                      )}

                    </div>

                    {/* DETAILS */}

                    <div>

                      <div className="flex items-center gap-3">

                        <h3 className="text-[24px] font-bold tracking-tight text-[#0F172A]">

                          {
                            trade.symbol
                          }

                        </h3>

                        <div
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold ${
                            buy

                              ? "bg-green-100 text-green-700"

                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          {
                            trade.type
                          }

                        </div>

                      </div>

                      <p className="mt-2 text-[14px] text-[#64748B]">

                        Quantity{" "}
                        <span className="font-bold text-[#0F172A]">

                          {
                            trade.quantity
                          }

                        </span>

                        {" • "}

                        Price ₹
                        <span className="font-bold text-[#0F172A]">

                          {
                            trade.price
                          }

                        </span>

                      </p>

                      {/* TIME */}

                      <div className="mt-4 flex items-center gap-2 text-[12px] text-[#64748B]">

                        <Clock3
                          size={14}
                        />

                        {new Date(
                          trade.executedAt
                        ).toLocaleDateString()}

                        {" • "}

                        {new Date(
                          trade.executedAt
                        ).toLocaleTimeString()}

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="text-right">

                    <p className="text-[12px] text-[#64748B]">

                      Trade Value

                    </p>

                    <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

                      ₹
                      {totalValue}

                    </h2>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

};

export default TradeHistory;