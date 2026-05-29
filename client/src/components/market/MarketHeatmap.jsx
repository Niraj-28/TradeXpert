import useMarketStore from "../../store/marketStore";

const MarketHeatmap = () => {
  const marketData =
    useMarketStore(
      (state) => state.marketData
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-white">
          Market Heatmap
        </h2>

        <span className="text-sm text-zinc-400">
          Live Market Sentiment
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {marketData.map((stock) => {
          const positive =
            Number(stock.change) >= 0;

          return (
            <div
              key={stock.instrumentKey}
              className={`rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                positive
                  ? "bg-green-500/15 border border-green-500/20"
                  : "bg-red-500/15 border border-red-500/20"
              }`}
            >
              <div className="text-sm text-zinc-300 mb-2 truncate">
                {stock.symbol}
              </div>

              <div className="text-2xl font-bold text-white mb-2">
                ₹{stock.price}
              </div>

              <div
                className={`text-sm font-semibold ${
                  positive
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stock.change}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketHeatmap;