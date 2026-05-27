import {

  useState,

} from "react";

import {

  ArrowUp,
  ArrowDown,
  Activity,

} from "lucide-react";

import {

  placeOrder,

} from "../../services/orderService";

const TradingPanel = ({

  marketData = [],

}) => {

  const [symbol, setSymbol] =
    useState("RELIANCE");

  const [quantity, setQuantity] =
    useState(1);

  const [type, setType] =
    useState("BUY");

  const [loading, setLoading] =
    useState(false);

  // LIVE STOCK

  const liveStock =

    marketData.find(

      (stock) =>

        stock.symbol ===
        symbol

    ) || {

      price: 0,

      change: 0,

    };

  const positive =

    Number(
      liveStock.change
    ) >= 0;

  // ORDER VALUE

  const totalValue =

    (
      Number(quantity) *

      Number(
        liveStock.price || 0
      )
    ).toFixed(2);

  // EXECUTE ORDER

  const handleOrder =
    async () => {

      try {

        setLoading(true);

        await placeOrder({

          symbol,

          quantity:
            Number(quantity),

          type,

          price: Number(
            liveStock.price
          ),

        });

        alert(
          `${type} order executed`
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="sticky top-5 bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[13px] text-[#64748B] font-medium">

            Trading Terminal

          </p>

          <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#0F172A]">

            Quick Trade

          </h2>

        </div>

        <div className="h-12 w-12 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center">

          <Activity size={22} />

        </div>

      </div>

      {/* BUY SELL */}

      <div className="grid grid-cols-2 gap-4 mt-8">

        <button
          onClick={() =>
            setType("BUY")
          }
          className={`h-14 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all ${
            type === "BUY"

              ? "bg-green-500 text-white"

              : "bg-[#F8FAFC] text-[#0F172A]"
          }`}
        >

          <ArrowUp size={18} />

          BUY

        </button>

        <button
          onClick={() =>
            setType("SELL")
          }
          className={`h-14 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all ${
            type === "SELL"

              ? "bg-red-500 text-white"

              : "bg-[#F8FAFC] text-[#0F172A]"
          }`}
        >

          <ArrowDown
            size={18}
          />

          SELL

        </button>

      </div>

      {/* STOCK SELECT */}

      <div className="mt-6">

        <label className="text-[12px] font-semibold text-[#64748B]">

          Select Stock

        </label>

        <select
          value={symbol}
          onChange={(e) =>
            setSymbol(
              e.target.value
            )
          }
          className="mt-2 w-full h-14 px-5 rounded-2xl border border-[#E8ECF2] bg-[#F8FAFC] outline-none focus:border-[#10B981]"
        >

          {marketData.map(
            (stock) => (

              <option
                key={
                  stock.symbol
                }
                value={
                  stock.symbol
                }
              >

                {stock.symbol}

              </option>

            )

          )}

        </select>

      </div>

      {/* LIVE PRICE */}

      <div className="mt-6 p-5 rounded-[24px] bg-[#F8FAFC] border border-[#EEF2F7]">

        <p className="text-[12px] text-[#64748B] font-medium">

          Live Market Price

        </p>

        <div className="mt-3 flex items-end justify-between">

          <h1 className="text-[42px] font-bold tracking-tight text-[#0F172A]">

            ₹
            {liveStock.price ||
              "--"}

          </h1>

          <div
            className={`px-4 py-2 rounded-2xl text-[13px] font-bold ${
              positive

                ? "bg-green-100 text-green-700"

                : "bg-red-100 text-red-700"
            }`}
          >

            {positive
              ? "+"
              : ""}
            {liveStock.change}%

          </div>

        </div>

      </div>

      {/* QUANTITY */}

      <div className="mt-6">

        <label className="text-[12px] font-semibold text-[#64748B]">

          Quantity

        </label>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              e.target.value
            )
          }
          className="mt-2 w-full h-14 px-5 rounded-2xl border border-[#E8ECF2] bg-[#F8FAFC] outline-none focus:border-[#10B981]"
        />

      </div>

      {/* ORDER VALUE */}

      <div className="mt-6 p-5 rounded-[24px] bg-[#0F172A] text-white">

        <p className="text-[12px] text-gray-300">

          Estimated Order Value

        </p>

        <h2 className="mt-2 text-[36px] font-bold tracking-tight">

          ₹
          {totalValue}
        </h2>

      </div>

      {/* BUTTON */}

      <button
        onClick={handleOrder}
        disabled={loading}
        className={`mt-6 w-full h-14 rounded-2xl text-[15px] font-bold text-white transition-all ${
          type === "BUY"

            ? "bg-green-500 hover:bg-green-600"

            : "bg-red-500 hover:bg-red-600"
        }`}
      >

        {loading

          ? "Processing..."

          : `${type} STOCK`}

      </button>

    </div>

  );

};

export default TradingPanel;