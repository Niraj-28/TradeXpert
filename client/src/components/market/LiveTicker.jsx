import { useMarket } from "../../context/MarketContext";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const LiveTicker = () => {
  const { trendingStocks } = useMarket();

  const tickerItems = trendingStocks?.length
    ? [...trendingStocks, ...trendingStocks, ...trendingStocks] // duplicate for infinite loop effect
    : Array.from({ length: 6 }, (_, index) => ({
        symbol: `STK${index + 1}`,
        price: "--",
        change: 0,
      }));

  return (
    <div className="live-ticker-container">
      <div className="live-ticker-track">
        {tickerItems.map((stock, index) => {
          const change = stock.change ?? 0;
          const isPositive = change >= 0;
          const hasPrice = stock.price !== "--" && stock.price !== undefined && !isNaN(Number(stock.price));
          const displayPrice = hasPrice ? Number(stock.price).toFixed(2) : "—";

          return (
            <div
              key={`${stock.symbol}-${index}`}
              className="live-ticker-item"
            >
              <span className="ticker-symbol">{stock.symbol}</span>
              <strong className="ticker-price">
                {displayPrice === "—" ? "—" : `₹${displayPrice}`}
              </strong>
              <span className={`ticker-change-pct ${isPositive ? "positive" : "negative"}`}>
                {isPositive ? (
                  <ArrowUpRight size={12} className="inline mr-0.5" />
                ) : (
                  <ArrowDownRight size={12} className="inline mr-0.5" />
                )}
                {Math.abs(change).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveTicker;