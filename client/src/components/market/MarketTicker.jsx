import useMarketStore from "../../store/marketStore";

const MarketTicker = () => {
  const marketData =
    useMarketStore(
      (state) => state.marketData
    );

  return (
    <div className="w-full overflow-hidden bg-white border-y border-zinc-200 py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...marketData, ...marketData].map(
          (stock, index) => (
            <div
              key={`${stock.instrumentKey}-${index}`}
              className="flex items-center mx-8"
            >
              <span className="text-zinc-900 font-semibold mr-3">
                {stock.symbol}
              </span>

              <span className="text-zinc-800 mr-3">
                ₹{stock.price}
              </span>


              <span
                className={`font-medium ${
                  Number(stock.change) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stock.change}%
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MarketTicker;