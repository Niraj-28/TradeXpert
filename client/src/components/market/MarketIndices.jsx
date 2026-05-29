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
    <div className="indices-grid">
      {cards.map((item, index) => (
        <div key={`${item.name}-${index}`} className="index-card">
          <h3>{item.name}</h3>
          <h2>{item.value}</h2>
          <p className={item.change >= 0 ? "positive" : "negative"}>
            {item.change}%
          </p>
        </div>
      ))}
    </div>
  );
};

export default MarketIndices;