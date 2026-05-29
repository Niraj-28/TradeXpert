import { useNavigate } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

const TrendingStocks = () => {
  const { trendingStocks } = useMarket();
  const navigate = useNavigate();

  const stocks = trendingStocks?.length
    ? trendingStocks
    : Array.from({ length: 6 }, (_, index) => ({
        symbol: `STK${index + 1}`,
        price: "—",
        change: 0,
      }));

  return (
    <div className="trending-section-wrapper">
      <div className="market-section-header">
        <div className="title-with-icon">
          <Activity className="section-title-icon text-[#37c98b]" size={22} />
          <h2 className="market-section-title">Trending Stocks</h2>
        </div>
        <p className="market-section-subtitle">Most active equities by volume and trade count today</p>
      </div>

      <div className="trending-cards-grid">
        {stocks.map((stock, index) => {
          const change = Number(stock.change ?? 0);
          const isPositive = change >= 0;
          const displayPrice = stock.price === "—" || stock.price === undefined
            ? "—" 
            : `₹${Number(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

          return (
            <div 
              key={`${stock.symbol}-${index}`} 
              className="trending-stock-card clickable-card"
              onClick={() => navigate(`/stocks/${stock.symbol.toUpperCase()}`)}
            >
              <div className="trend-card-left">
                <span className="trend-symbol">{stock.symbol}</span>
                <span className="trend-exchange-pill">NSE</span>
              </div>
              
              <div className="trend-card-right">
                <span className="trend-price">{displayPrice}</span>
                <span className={`trend-change-badge ${isPositive ? "positive" : "negative"}`}>
                  {isPositive ? (
                    <ArrowUpRight size={12} className="inline mr-0.5" />
                  ) : (
                    <ArrowDownRight size={12} className="inline mr-0.5" />
                  )}
                  {Math.abs(change).toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingStocks;