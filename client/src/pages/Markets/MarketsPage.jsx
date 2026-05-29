import LiveTicker from "../../components/market/LiveTicker";
import MarketIndices from "../../components/market/MarketIndices";
import TrendingStocks from "../../components/market/TrendingStocks";
import DiscoverStocks from "../../components/market/DiscoverStocks";
import MarketTable from "../../components/market/MarketTable";
import TopGainers from "../../components/market/TopGainers";
import TopLosers from "../../components/market/TopLosers";
import SectorPerformance from "../../components/market/SectorPerformance";

const MarketsPage = () => {
  return (
    <div className="markets-page">

      <LiveTicker />

      <MarketIndices />

      <TrendingStocks />

      <div className="discover-section">
        <div className="section-header">
          <h1>Search Stocks</h1>
          <p>Discover stocks, ETFs, indices and more</p>
        </div>

        <DiscoverStocks />

        <MarketTable />
      </div>

      <div className="movers-grid">
        <TopGainers />
        <TopLosers />
      </div>

      <SectorPerformance />

    </div>
  );
};

export default MarketsPage;