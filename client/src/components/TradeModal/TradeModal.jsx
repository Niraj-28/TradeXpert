import { useState } from "react";

import toast from "react-hot-toast";

import {

  buyStock,

  sellStock,

} from "../../services/tradeService";

const TradeModal = ({

  stock,
  type,
  onClose,

}) => {

  const [quantity, setQuantity] = useState(1);

  const handleTrade = async () => {

    try {

      const payload = {

        stockSymbol: stock.symbol,

        stockName: stock.name,

        quantity: Number(quantity),

        price: stock.price,

      };

      if (type === "BUY") {

        await buyStock(payload);

        toast.success("Stock Bought");

      } else {

        await sellStock(payload);

        toast.success("Stock Sold");

      }

      onClose();

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Trade Failed"

      );

    }

  };

  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-[32px] p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6">

          {type} {stock.name}

        </h1>

        <div className="space-y-5">

          <div>

            <p className="text-sm text-[#64748B] mb-2">

              Current Price

            </p>

            <h2 className="text-4xl font-bold">

              ₹{stock.price}

            </h2>

          </div>

          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            className="w-full h-14 border border-[#E2E8F0] rounded-2xl px-5 outline-none"
            placeholder="Quantity"
          />

          <button
            onClick={handleTrade}
            className="w-full h-14 bg-[#58E6B3] rounded-2xl font-semibold"
          >

            Confirm {type}

          </button>

        </div>

      </div>

    </div>

  );

};

export default TradeModal;