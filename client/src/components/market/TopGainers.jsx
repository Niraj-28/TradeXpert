import { useNavigate } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { ArrowUpRight } from "lucide-react";

const TopGainers = () => {
  const { topGainers } = useMarket();
  const navigate = useNavigate();

  const gainers = topGainers?.length
    ? topGainers
    : Array.from({ length: 3 }, (_, index) => ({
        symbol: `GAIN${index + 1}`,
        price: "—",
        change: 0,
      }));

  return (
    <div className="mover-card-panel gainer-panel">
      <div className="mover-card-header">
        <h3 className="mover-title">Top Gainers</h3>
        <span className="mover-sub">Highest daily gains</span>
      </div>

      <div className="mover-items-list">
        {gainers.map((stock, index) => {
          const change = Number(stock.change ?? 0);
          const displayPrice = stock.price === "--" || stock.price === "—" || stock.price === undefined
            ? "—"
            : `₹${Number(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

          return (
            <div 
              key={`${stock.symbol}-${index}`} 
              className="mover-item-row clickable-row"
              onClick={() => navigate(`/stocks/${stock.symbol.toUpperCase()}`)}
            >
              <div className="mover-stock-info">
                <span className="mover-stock-symbol">{stock.symbol}</span>
                <span className="mover-stock-price">{displayPrice}</span>
              </div>
              <span className="mover-change-badge positive">
                <ArrowUpRight size={13} className="inline mr-0.5" />
                +{change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopGainers;