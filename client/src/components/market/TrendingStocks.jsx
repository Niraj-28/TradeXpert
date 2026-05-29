import { useMarket } from "../../context/MarketContext";

const TrendingStocks = () => {
  const { trendingStocks } = useMarket();

  const stocks = trendingStocks?.length
    ? trendingStocks
    : Array.from({ length: 6 }, (_, index) => ({
        symbol: `STK${index + 1}`,
        price: "--",
      }));

  return (
    <div>
      <div className="section-header">
        <h1>Trending Stocks</h1>
        <p>Most active stocks today</p>
      </div>

      <div className="trending-grid">
        {stocks.map((stock, index) => (
          <div key={`${stock.symbol}-${index}`} className="trending-card">
            <div>
              <h3>{stock.symbol}</h3>
              <p>Trending</p>
            </div>
            <div className="trend-right">
              <h4>{stock.price === "—" ? "—" : `₹${stock.price}`}</h4>
              <span>Live</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingStocks;