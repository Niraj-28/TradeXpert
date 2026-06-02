import useMoversStore from "../../store/moversStore";

const MarketMovers = () => {
  const topGainers =
    useMoversStore(
      (state) => state.topGainers
    );

  const topLosers =
    useMoversStore(
      (state) => state.topLosers
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h2 className="text-xl font-semibold text-green-500 mb-5">
          Top Gainers
        </h2>

        <div className="space-y-3">
          {topGainers.map((stock, index) => (
            <div
              key={stock.symbol || stock.instrumentKey || index}
              className="flex items-center justify-between bg-zinc-800 rounded-xl p-3"
            >
              <div>
                <div className="text-white font-medium">
                  {stock.symbol}
                </div>

                <div className="text-sm text-zinc-400">
                  ₹{stock.price}
                </div>
              </div>

              <div className="text-green-500 font-semibold">
                +{stock.change}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h2 className="text-xl font-semibold text-red-500 mb-5">
          Top Losers
        </h2>

        <div className="space-y-3">
          {topLosers.map((stock, index) => (
            <div
              key={stock.symbol || stock.instrumentKey || index}
              className="flex items-center justify-between bg-zinc-800 rounded-xl p-3"
            >
              <div>
                <div className="text-white font-medium">
                  {stock.symbol}
                </div>

                <div className="text-sm text-zinc-400">
                  ₹{stock.price}
                </div>
              </div>

              <div className="text-red-500 font-semibold">
                {stock.change}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketMovers;