import { useParams } from "react-router-dom";

import TradingChart from "../../components/chart/TradingChart";

const StockDetails = () => {
  const { symbol } = useParams();

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6">
      {/* Stock Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              {symbol}
            </h1>

            <p className="text-zinc-400 mt-2">
              NSE Equity
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold text-white">
              ₹2,845.00
            </div>

            <div className="text-green-500 font-semibold mt-2">
              +1.42%
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            Price Chart
          </h2>

          <div className="flex gap-2">
            <button className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
              1D
            </button>

            <button className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
              1W
            </button>

            <button className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
              1M
            </button>

            <button className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
              1Y
            </button>
          </div>
        </div>

        <TradingChart />
        
      </div>

      {/* Stock Info + Trade Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Stock Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-zinc-400 text-sm mb-2">
                Open
              </div>

              <div className="text-xl font-semibold">
                ₹2,810
              </div>
            </div>

            <div>
              <div className="text-zinc-400 text-sm mb-2">
                High
              </div>

              <div className="text-xl font-semibold">
                ₹2,860
              </div>
            </div>

            <div>
              <div className="text-zinc-400 text-sm mb-2">
                Low
              </div>

              <div className="text-xl font-semibold">
                ₹2,790
              </div>
            </div>

            <div>
              <div className="text-zinc-400 text-sm mb-2">
                Volume
              </div>

              <div className="text-xl font-semibold">
                12.4M
              </div>
            </div>
          </div>
        </div>

        {/* Buy Sell Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Trade
          </h2>

          <div className="space-y-4">
            <input
              type="number"
              placeholder="Quantity"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />

            <button className="w-full bg-green-600 hover:bg-green-700 transition-all py-3 rounded-xl font-semibold">
              Buy
            </button>

            <button className="w-full bg-red-600 hover:bg-red-700 transition-all py-3 rounded-xl font-semibold">
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;