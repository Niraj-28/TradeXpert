import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LiveTicker from "../../components/market/LiveTicker";
import MarketIndices from "../../components/market/MarketIndices";
import TrendingStocks from "../../components/market/TrendingStocks";
import DiscoverStocks from "../../components/market/DiscoverStocks";
import MarketTable from "../../components/market/MarketTable";
import TopGainers from "../../components/market/TopGainers";
import TopLosers from "../../components/market/TopLosers";
import SectorPerformance from "../../components/market/SectorPerformance";
import { useMarket } from "../../context/MarketContext";
import StockLogo from "../../components/ui/StockLogo";

const MarketsPage = () => {
  const navigate = useNavigate();
  const { topGainers, topLosers } = useMarket();
  const [activeMoverTab, setActiveMoverTab] = useState("gainers");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInitiateTrade = (stock, type = "BUY") => {
    navigate(`/stocks/${stock.symbol.toUpperCase()}?type=${type}`);
  };

  const renderMobileTopMovers = () => {
    const list = activeMoverTab === "gainers" ? topGainers : topLosers;
    const items = list?.length 
      ? list.slice(0, 3) 
      : Array.from({ length: 3 }, (_, index) => ({
          symbol: activeMoverTab === "gainers" ? `GAIN${index + 1}` : `LOSS${index + 1}`,
          price: activeMoverTab === "gainers" ? 100 + index * 10 : 100 - index * 10,
          change: activeMoverTab === "gainers" ? 2.5 + index * 0.5 : -2.5 - index * 0.5,
        }));

    return (
      <div className="mobile-top-movers-section">
        <div className="market-section-header flex-header">
          <h2 className="market-section-title">Top Movers Today</h2>
          <div className="mover-pills-container">
            <button 
              className={`mover-pill ${activeMoverTab === "gainers" ? "active gainer" : ""}`}
              onClick={() => setActiveMoverTab("gainers")}
            >
              Gainers
            </button>
            <button 
              className={`mover-pill ${activeMoverTab === "losers" ? "active loser" : ""}`}
              onClick={() => setActiveMoverTab("losers")}
            >
              Losers
            </button>
          </div>
        </div>

        <div className="mobile-movers-grid">
          {items.map((stock, index) => {
            const changePercent = Number(stock.change ?? 0);
            const price = parseFloat(stock.price) || 0;
            const isPositive = changePercent >= 0;
            
            const prevPrice = price / (1 + changePercent / 100);
            const absChange = price - prevPrice;

            const displayPrice = price === 0 || isNaN(price)
              ? "—"
              : `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const absVal = Math.abs(absChange).toFixed(2);
            const pctVal = Math.abs(changePercent).toFixed(2);
            const displayChange = price === 0 || isNaN(price)
              ? "—"
              : `${isPositive ? "+" : "-"}${absVal} (${isPositive ? "+" : "-"}${pctVal}%)`;

            return (
              <div 
                key={`${stock.symbol}-${index}`}
                className="mobile-mover-card clickable-card"
                onClick={() => navigate(`/stocks/${stock.symbol.toUpperCase()}`)}
              >
                <div className="mover-card-logo-row">
                  <StockLogo symbol={stock.symbol} size={32} />
                </div>
                <div className="mover-card-name-row">
                  <span className="mover-card-company">{stock.name || stock.symbol}</span>
                </div>
                <div className="mover-card-price-row">
                  <span className="mover-card-price">{displayPrice}</span>
                  <span className={`mover-card-change ${isPositive ? "positive" : "negative"}`}>
                    {isPositive ? "+" : ""}{absVal} ({isPositive ? "+" : ""}{pctVal}%)
                  </span>
                </div>
              </div>
            );
          })}

          <div 
            className="mobile-mover-card market-trends-card clickable-card"
            onClick={() => {
              const el = document.getElementById("market-table-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="trends-icons-grid">
              <StockLogo symbol="RELIANCE" size={16} />
              <StockLogo symbol="TCS" size={16} />
              <StockLogo symbol="INFY" size={16} />
              <StockLogo symbol="TATAMOTORS" size={16} />
            </div>
            <div className="trends-label-row">
              <span className="trends-text">Market trends</span>
              <span className="trends-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    );
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

        {/* LIVE MARKET DASHBOARD SECTION */}
        <div id="market-table-section" className="discover-market-section">
          <MarketTable onTrade={handleInitiateTrade} />
        </div>

        {/* MARKET MOVERS (GAINERS & LOSERS) */}
        {isMobile ? (
          renderMobileTopMovers()
        ) : (
          <div className="movers-layout-grid">
            <TopGainers />
            <TopLosers />
          </div>
        )}

        {/* SECTOR PERFORMANCE */}
        <SectorPerformance />
      </div>
    </div>
  );
};

export default MarketsPage;