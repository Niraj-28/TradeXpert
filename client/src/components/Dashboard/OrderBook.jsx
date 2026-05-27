import {

  useEffect,
  useState,

} from "react";

import {

  ArrowUp,
  ArrowDown,
  Clock3,
  CheckCircle2,

} from "lucide-react";

import {

  getOrders,

} from "../../services/orderService";

const OrderBook = () => {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH ORDERS

  const fetchOrders =
    async () => {

      try {

        const data =
          await getOrders();

        setOrders(
          data.orders || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // AUTO REFRESH

  useEffect(() => {

    fetchOrders();

    const interval =
      setInterval(() => {

        fetchOrders();

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

            Order Management

          </p>

          <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

            Order Book

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

            Loading orders...

          </p>

        </div>

      )}

      {/* EMPTY */}

      {!loading &&
        orders.length === 0 && (

          <div className="py-14 text-center">

            <p className="text-[14px] text-[#64748B]">

              No orders found

            </p>

          </div>

        )}

      {/* ORDERS */}

      {orders.length > 0 && (

        <div className="mt-8 space-y-4">

          {orders.map((order) => {

            const buy =
              order.type ===
              "BUY";

            const executed =
              order.status ===
              "EXECUTED";

            return (

              <div
                key={order._id}
                className="rounded-[24px] border border-[#EEF2F7] p-5 hover:bg-[#FAFBFC] transition-all"
              >

                {/* TOP */}

                <div className="flex items-start justify-between">

                  {/* LEFT */}

                  <div>

                    <div className="flex items-center gap-3">

                      <div
                        className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                          buy

                            ? "bg-green-100 text-green-600"

                            : "bg-red-100 text-red-600"
                        }`}
                      >

                        {buy ? (

                          <ArrowUp
                            size={20}
                          />

                        ) : (

                          <ArrowDown
                            size={20}
                          />

                        )}

                      </div>

                      <div>

                        <h3 className="text-[20px] font-bold tracking-tight text-[#0F172A]">

                          {
                            order.symbol
                          }

                        </h3>

                        <p className="text-[12px] text-[#64748B] mt-1">

                          {order.type} • Qty{" "}
                          {
                            order.quantity
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div
                    className={`px-4 py-2 rounded-2xl text-[12px] font-bold flex items-center gap-2 ${
                      executed

                        ? "bg-green-100 text-green-700"

                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >

                    {executed ? (

                      <CheckCircle2
                        size={16}
                      />

                    ) : (

                      <Clock3
                        size={16}
                      />

                    )}

                    {
                      order.status
                    }

                  </div>

                </div>

                {/* DETAILS */}

                <div className="mt-6 grid grid-cols-3 gap-5">

                  {/* PRICE */}

                  <div>

                    <p className="text-[11px] text-[#64748B]">

                      Price

                    </p>

                    <h4 className="mt-1 text-[18px] font-bold text-[#0F172A]">

                      ₹
                      {
                        order.price
                      }

                    </h4>

                  </div>

                  {/* VALUE */}

                  <div>

                    <p className="text-[11px] text-[#64748B]">

                      Total Value

                    </p>

                    <h4 className="mt-1 text-[18px] font-bold text-[#0F172A]">

                      ₹
                      {(
                        order.price *

                        order.quantity
                      ).toFixed(
                        2
                      )}

                    </h4>

                  </div>

                  {/* TIME */}

                  <div>

                    <p className="text-[11px] text-[#64748B]">

                      Time

                    </p>

                    <h4 className="mt-1 text-[15px] font-bold text-[#0F172A]">

                      {new Date(
                        order.createdAt
                      ).toLocaleTimeString()}

                    </h4>

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

export default OrderBook;