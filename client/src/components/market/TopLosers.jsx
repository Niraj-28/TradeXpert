import { useNavigate } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { ArrowDownRight } from "lucide-react";
import StockLogo from "../ui/StockLogo";

const TopLosers = () => {
  const { topLosers } = useMarket();
  const navigate = useNavigate();

  const losers = topLosers?.length
    ? topLosers
    : Array.from({ length: 5 }, (_, index) => ({
        symbol: `LOSS${index + 1}`,
        price: "—",
        change: 0,
      }));

  return (
    <div className="mover-card-panel loser-panel">
      <div className="mover-card-header">
        <h3 className="mover-title">Top Losers</h3>
        <span className="mover-sub">Lowest daily gains</span>
      </div>

      <div className="mover-items-list">
        {losers.map((stock, index) => {
          const change = Number(stock.change ?? 0);
          const displayPrice = stock.price === "--" || stock.price === "—" || stock.price === undefined
            ? "—"
            : `₹${Number(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

          return (
            <div 
              key={`${stock.symbol}-${index}`} 
              className="mover-item-row clickable-row"
              onClick={() => navigate(`/stocks/${stock.symbol.toUpperCase()}`)}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <StockLogo symbol={stock.symbol} size={28} />
              <div className="mover-stock-info" style={{ flex: 1 }}>
                <span className="mover-stock-symbol">{stock.symbol}</span>
                <span className="mover-stock-price">{displayPrice}</span>
              </div>
              <span className="mover-change-badge negative">
                <ArrowDownRight size={13} className="inline mr-0.5" />
                {change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopLosers;