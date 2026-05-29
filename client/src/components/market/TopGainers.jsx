import { useMarket } from "../../context/MarketContext";

const TopGainers = () => {
  const { topGainers } = useMarket();

  const gainers = topGainers?.length
    ? topGainers
    : Array.from({ length: 4 }, (_, index) => ({
        symbol: `GAIN${index + 1}`,
        price: "--",
        change: 0,
      }));

  return (
    <div className="mover-card">
      <h2>Top Gainers</h2>

      {gainers.map((stock, index) => (
        <div key={`${stock.symbol}-${index}`} className="mover-item">
          <div>
            <h4>{stock.symbol}</h4>
            <p>{stock.price === "--" ? "—" : `₹${stock.price}`}</p>
          </div>
          <span className="positive">+{stock.change}%</span>
        </div>
      ))}
    </div>
  );
};

export default TopGainers;