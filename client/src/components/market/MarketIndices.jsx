import { useMarket } from "../../context/MarketContext";

const MarketIndices = () => {
  const { indices } = useMarket();

  const cards = indices?.length
    ? indices
    : [
        { name: "NIFTY 50", value: "—", change: 0 },
        { name: "BANK NIFTY", value: "—", change: 0 },
        { name: "SENSEX", value: "—", change: 0 },
        { name: "NIFTY IT", value: "—", change: 0 },
      ];

  return (
    <div className="market-indices-grid">
      {cards.map((item, index) => {
        const isPositive = item.change >= 0;
        const displayValue = typeof item.value === 'number' 
          ? `₹${item.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
          : item.value;

        return (
          <div key={`${item.name}-${index}`} className={`market-index-card ${isPositive ? "pos-border" : "neg-border"}`}>
            <div className="index-header-row">
              <span className="index-title">{item.name}</span>
              <span className={`index-change-pill ${isPositive ? "positive" : "negative"}`}>
                {isPositive ? "+" : ""}{item.change.toFixed(2)}%
              </span>
            </div>
            <div className="index-price-val">
              {displayValue}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MarketIndices;