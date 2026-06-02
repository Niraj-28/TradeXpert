import LiveTicker from "../../components/market/LiveTicker";

import IndicesBar from "../../components/market/IndicesBar";

import DiscoverStocks from "../../components/market/DiscoverStocks";

import TopMovers from "../../components/market/TopMovers";

import MarketTable from "../../components/market/MarketTable";

import SectorPerformance from "../../components/market/SectorPerformance";

const Markets = () => {
  return (
    <div className="markets-page">

      {/* LIVE TICKER */}
      <LiveTicker />

      {/* INDICES */}
      <IndicesBar />

      {/* DISCOVER */}
      <DiscoverStocks />

      {/* TOP MOVERS */}
      <TopMovers />

      {/* MARKET TABLE */}
      <MarketTable />

      {/* SECTOR PERFORMANCE */}
      <SectorPerformance />

    </div>
  );
};

export default Markets;