import {

  useState,

} from "react";

import toast from "react-hot-toast";

import {

  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,

} from "lucide-react";

import {

  placeTrade,

} from "../../services/tradeService";

const TradingPanel = () => {

  const [orderType, setOrderType] =

    useState("BUY");

  const [quantity, setQuantity] =

    useState(1);

  const [price, setPrice] =

    useState(2985);

  const [loading, setLoading] =

    useState(false);

  const total = quantity * price;

  const handleTrade = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem(

        "token"

      );

      const tradeData = {

        symbol: "RELIANCE",

        type: orderType,

        quantity,

        price,

      };

      await placeTrade(

        tradeData,

        token

      );

      toast.success(

        `${orderType} Order Executed`

      );

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Trade Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="bg-white border border-[#E2E8F0] rounded-[30px] p-6 shadow-sm mt-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <p className="text-sm text-[#64748B] font-medium">

            Live Trading

          </p>

          <h2 className="text-3xl font-bold text-[#0F172A] mt-1">

            Trading Panel

          </h2>

        </div>

        {/* BUY / SELL */}

        <div className="flex items-center gap-3">

          <button
            onClick={() => setOrderType("BUY")}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              orderType === "BUY"

                ? "bg-green-500 text-white"

                : "bg-[#F1F5F9] text-[#0F172A]"

            }`}
          >

            Buy

          </button>

          <button
            onClick={() => setOrderType("SELL")}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              orderType === "SELL"

                ? "bg-red-500 text-white"

                : "bg-[#F1F5F9] text-[#0F172A]"

            }`}
          >

            Sell

          </button>

        </div>

      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* LEFT */}

        <div className="space-y-6">

          {/* STOCK */}

          <div>

            <label className="text-sm font-medium text-[#64748B]">

              Stock Symbol

            </label>

            <input
              type="text"
              value="RELIANCE"
              readOnly
              className="w-full h-14 mt-2 px-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] outline-none"
            />

          </div>

          {/* QUANTITY */}

          <div>

            <label className="text-sm font-medium text-[#64748B]">

              Quantity

            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
              className="w-full h-14 mt-2 px-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] outline-none focus:border-[#58E6B3]"
            />

          </div>

          {/* PRICE */}

          <div>

            <label className="text-sm font-medium text-[#64748B]">

              Price

            </label>

            <div className="relative">

              <IndianRupee
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B]"
              />

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(Number(e.target.value))
                }
                className="w-full h-14 mt-2 pl-12 pr-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] outline-none focus:border-[#58E6B3]"
              />

            </div>

          </div>

          {/* ORDER TYPE */}

          <div>

            <label className="text-sm font-medium text-[#64748B]">

              Order Type

            </label>

            <select className="w-full h-14 mt-2 px-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] outline-none focus:border-[#58E6B3]">

              <option>

                Market Order

              </option>

              <option>

                Limit Order

              </option>

            </select>

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-[#F8FAFC] rounded-[30px] p-6 border border-[#E2E8F0]">

          <div className="flex items-center justify-between mb-8">

            <div>

              <p className="text-sm text-[#64748B]">

                Order Summary

              </p>

              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">

                {orderType} RELIANCE

              </h3>

            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                orderType === "BUY"

                  ? "bg-green-100"

                  : "bg-red-100"

              }`}
            >

              {orderType === "BUY" ? (

                <ArrowUpRight
                  size={28}
                  className="text-green-600"
                />

              ) : (

                <ArrowDownRight
                  size={28}
                  className="text-red-600"
                />

              )}

            </div>

          </div>

          {/* DETAILS */}

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-[#64748B]">

                Quantity

              </span>

              <span className="font-semibold text-[#0F172A]">

                {quantity}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-[#64748B]">

                Price

              </span>

              <span className="font-semibold text-[#0F172A]">

                ₹{price}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-[#64748B]">

                Brokerage

              </span>

              <span className="font-semibold text-[#0F172A]">

                ₹20

              </span>

            </div>

            <div className="border-t border-[#E2E8F0] pt-5 flex justify-between">

              <span className="text-lg font-semibold text-[#0F172A]">

                Total

              </span>

              <span className="text-2xl font-bold text-[#0F172A]">

                ₹{total}

              </span>

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={handleTrade}
            disabled={loading}
            className={`w-full h-14 rounded-2xl font-semibold mt-8 transition-all ${
              orderType === "BUY"

                ? "bg-green-500 hover:bg-green-600 text-white"

                : "bg-red-500 hover:bg-red-600 text-white"

            }`}
          >

            {loading

              ? "Processing..."

              : `Confirm ${orderType}`}

          </button>

        </div>

      </div>

    </div>

  );

};

export default TradingPanel;