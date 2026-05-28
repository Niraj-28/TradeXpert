import LiveTicker from "../../components/Dashboard/LiveTicker";
import MarketIndices from "../../components/Dashboard/MarketIndices";
import MarketCards from "../../components/Dashboard/MarketCards";
import TopMovers from "../../components/Dashboard/TopMovers";
import MarketChart from "../../components/Dashboard/MarketChart";
import PortfolioOverview from "../../components/Dashboard/PortfolioOverview";
import TradeHistory from "../../components/Dashboard/TradeHistory";

const Markets = () => {
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
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            All NSE & BSE Stocks
          </h3>
          <MarketCards />
        </div>
      </div>

      {/* TOP MOVERS */}
      <div className="px-8 mt-10">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden p-6">
          <TopMovers />
        </div>
      </div>

      {/* CHART + PORTFOLIO */}
      <div className="px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-stretch">
          {/* Left: chart (fluid) */}
          <div className="h-full">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden h-full">
              <MarketChart />
            </div>
          </div>

          {/* Right: portfolio */}
          <div className="h-full">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden h-full">
              <PortfolioOverview />
            </div>
          </div>
        </div>
      </div>

      {/* TRADE HISTORY */}
      <div className="px-8 mt-10 pb-10">
        <TradeHistory />
      </div>
    </div>
  );
};

export default Markets;


