import { useMarket } from "../../context/MarketContext";

const LiveTicker = () => {
  const { trendingStocks } = useMarket();

  const tickerItems = trendingStocks?.length
    ? [...trendingStocks, ...trendingStocks]
    : Array.from({ length: 6 }, (_, index) => ({
        symbol: `STK${index + 1}`,
        price: "--",
        change: "0.00",
      }));

  return (
    <div className="live-ticker">

      <div className="ticker-track">

        {tickerItems.map((stock, index) => {
          const change = stock.change ?? "0.00";
          const changeText = change.toString();

          return (
            <div
              key={`${stock.symbol}-${index}`}
              className="ticker-item"
            >
              <span>{stock.symbol}</span>

              <strong>
                {stock.price === "--" ? "—" : `₹${stock.price}`}
              </strong>

              <p
                className={
                  changeText.includes("-")
                    ? "negative"
                    : "positive"
                }
              >
                {changeText}
              </p>
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default LiveTicker;