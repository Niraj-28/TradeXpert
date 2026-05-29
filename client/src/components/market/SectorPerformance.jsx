import { useMarket } from "../../context/MarketContext";

const SectorPerformance = () => {
  const { sectors } = useMarket();

  const sectorCards = sectors?.length
    ? sectors
    : Array.from({ length: 5 }, (_, index) => ({
        sector: `Sector ${index + 1}`,
        change: 0,
      }));

  return (
    <div className="sector-section">
      <div className="section-header">
        <h1>Sector Performance</h1>
        <p>Sector-wise market overview</p>
      </div>

      <div className="sector-grid">
        {sectorCards.map((sector, index) => (
          <div key={`${sector.sector}-${index}`} className="sector-card">
            <h3>{sector.sector}</h3>
            <span className={sector.change >= 0 ? "positive" : "negative"}>
              {sector.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorPerformance;