import { useMarket } from "../../context/MarketContext";

const LiveTicker = () => {
  const { trendingStocks } = useMarket();

  return (
    <div className="live-ticker">

      <div className="ticker-track">

        {[...trendingStocks, ...trendingStocks]
          .map((stock, index) => (

          <div
            key={index}
            className="ticker-item"
          >
            <span>{stock.symbol}</span>

            <strong>
              ₹{stock.price}
            </strong>

            <p
              className={
                stock.change.includes("-")
                  ? "negative"
                  : "positive"
              }
            >
              {stock.change}
            </p>
          </div>

        ))}

      </div>

    </div>
  );
};

export default LiveTicker;