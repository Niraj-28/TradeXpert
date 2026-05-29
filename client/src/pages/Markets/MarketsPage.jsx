import { useNavigate } from "react-router-dom";
import LiveTicker from "../../components/market/LiveTicker";
import MarketIndices from "../../components/market/MarketIndices";
import TrendingStocks from "../../components/market/TrendingStocks";
import DiscoverStocks from "../../components/market/DiscoverStocks";
import MarketTable from "../../components/market/MarketTable";
import TopGainers from "../../components/market/TopGainers";
import TopLosers from "../../components/market/TopLosers";
import SectorPerformance from "../../components/market/SectorPerformance";

const MarketsPage = () => {
  const navigate = useNavigate();

  const handleInitiateTrade = (stock, type = "BUY") => {
    navigate(`/stocks/${stock.symbol.toUpperCase()}?type=${type}`);
  };

  return (
    <div className="markets-page-container">
      {/* LIVE TICKER */}
      <LiveTicker />

      {/* CORE GRID LAYOUT */}
      <div className="markets-inner-wrapper">
        {/* INDICES BAR */}
        <MarketIndices />

        {/* TRENDING STOCKS */}
        <TrendingStocks />

        {/* DISCOVER & SEARCH SECTION */}
        <div className="discover-market-section">
          <div className="market-section-header">
            <h1 className="market-section-title">Search & Discovery</h1>
            <p className="market-section-subtitle">
              Look up active NSE/BSE tickers, view pricing details, and place quick orders
            </p>
          </div>

          <DiscoverStocks onTrade={handleInitiateTrade} />
          
          <MarketTable onTrade={handleInitiateTrade} />
        </div>

        {/* MARKET MOVERS (GAINERS & LOSERS) */}
        <div className="movers-layout-grid">
          <TopGainers />
          <TopLosers />
        </div>

        {/* SECTOR PERFORMANCE */}
        <SectorPerformance />
      </div>
    </div>
  );
};

export default MarketsPage;