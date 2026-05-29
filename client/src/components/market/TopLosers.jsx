import { useMarket } from "../../context/MarketContext";

const TopLosers = () => {
  const { topLosers } = useMarket();

  const losers = topLosers?.length
    ? topLosers
    : Array.from({ length: 4 }, (_, index) => ({
        symbol: `LOSS${index + 1}`,
        price: "--",
        change: 0,
      }));

  return (
    <div className="mover-card">
      <h2>Top Losers</h2>

      {losers.map((stock, index) => (
        <div key={`${stock.symbol}-${index}`} className="mover-item">
          <div>
            <h4>{stock.symbol}</h4>
            <p>{stock.price === "--" ? "—" : `₹${stock.price}`}</p>
          </div>
          <span className="negative">{stock.change}%</span>
        </div>
      ))}
    </div>
  );
};

export default TopLosers;