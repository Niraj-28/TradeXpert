import { useMarket } from "../../context/MarketContext";
import { FolderHeart } from "lucide-react";

const SectorPerformance = () => {
  const { sectors } = useMarket();

  const sectorCards = sectors?.length
    ? sectors
    : Array.from({ length: 5 }, (_, index) => ({
        sector: `Sector ${index + 1}`,
        change: 0,
      }));

  return (
    <div className="sector-performance-section">
      <div className="market-section-header">
        <div className="title-with-icon">
          <FolderHeart className="section-title-icon text-[#37c98b]" size={22} />
          <h2 className="market-section-title">Sector Performance</h2>
        </div>
        <p className="market-section-subtitle">Real-time daily sectoral index trends</p>
      </div>

      <div className="sectors-performance-grid">
        {sectorCards.map((sector, index) => {
          const change = Number(sector.change ?? 0);
          const isPositive = change >= 0;
          
          // Calculate a percentage width for progress visualization (max 5%)
          const barWidth = Math.min(100, (Math.abs(change) / 5) * 100);

          return (
            <div key={`${sector.sector}-${index}`} className="sector-performance-card">
              <div className="sector-card-top">
                <span className="sector-name-title">{sector.sector}</span>
                <span className={`sector-change-text ${isPositive ? "positive" : "negative"}`}>
                  {isPositive ? "+" : ""}{change.toFixed(2)}%
                </span>
              </div>
              
              {/* Progress visualizer bar */}
              <div className="sector-bar-bg">
                <div 
                  className={`sector-bar-fill ${isPositive ? "positive-bar" : "negative-bar"}`} 
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorPerformance;