import LiveTicker from "../../components/Dashboard/LiveTicker";
import MarketIndices from "../../components/Dashboard/MarketIndices";
import MarketCards from "../../components/Dashboard/MarketCards";
import TopMovers from "../../components/Dashboard/TopMovers";
import WatchlistPanel from "../../components/Dashboard/WatchlistPanel";
import TradeHistory from "../../components/Dashboard/TradeHistory";
import MarketChart from "../../components/Dashboard/MarketChart";
import PortfolioOverview from "../../components/Dashboard/PortfolioOverview";

const Watchlist = () => {
  return (
    <div className="bg-[#F4F7FB] min-h-screen">
      {/* LIVE TICKER */}
      <div className="px-8 pt-6">
        <LiveTicker />
      </div>

      {/* MARKET INDICES */}
      <div className="px-8 mt-6">
        <MarketIndices />
      </div>

      {/* LIVE MARKET */}
      <div className="px-8 mt-10">
        <MarketCards />
      </div>

      {/* TOP MOVERS */}
      <div className="px-8 mt-10">
        <TopMovers />
      </div>

      {/* CHART + PORTFOLIO */}
      <div className="px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-stretch">
          <div className="h-full">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden h-full">
              <MarketChart />
            </div>
          </div>

          <div className="h-full">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden h-full">
              <PortfolioOverview />
            </div>
          </div>
        </div>
      </div>

      {/* WATCHLIST */}
      <div className="px-8 mt-10">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden p-6">
          <WatchlistPanel />
        </div>
      </div>

      {/* TRADE HISTORY */}
      <div className="px-8 mt-10 pb-10">
        <TradeHistory />
      </div>
    </div>
  );
};

export default Watchlist;

