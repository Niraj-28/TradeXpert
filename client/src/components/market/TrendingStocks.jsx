import { useNavigate } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { Activity } from "lucide-react";
import StockLogo from "../ui/StockLogo";

const companyNameMap = {
  RELIANCE: "Reliance Industries",
  TCS: "Tata Consultancy Services",
  INFY: "Infosys Limited",
  HDFCBANK: "HDFC Bank",
  ICICIBANK: "ICICI Bank",
  SBIN: "State Bank of India",
  BHARTIARTL: "Bharti Airtel",
  ITC: "ITC Limited",
  LT: "Larsen & Toubro",
  TATASTEEL: "Tata Steel",
  TATAMOTORS: "Tata Motors",
  WIPRO: "Wipro Limited",
  AXISBANK: "Axis Bank",
  KOTAKBANK: "Kotak Mahindra Bank",
  HINDUNILVR: "Hindustan Unilever",
  ADANIENT: "Adani Enterprises",
  BAJFINANCE: "Bajaj Finance",
  MARUTI: "Maruti Suzuki",
  SUNPHARMA: "Sun Pharmaceutical",
  "M&M": "Mahindra & Mahindra",
  ONGC: "Oil & Natural Gas Corp",
  POWERGRID: "Power Grid Corp",
  NTPC: "NTPC Limited",
  COALINDIA: "Coal India",
  ADANIPORTS: "Adani Ports & SEZ",
  ULTRACEMCO: "UltraTech Cement",
  GRASIM: "Grasim Industries",
  JSWSTEEL: "JSW Steel",
  LTIM: "LTIMindtree",
  HINDALCO: "Hindalco Industries",
  DMART: "Avenue Supermarts",
  SIEMENS: "Siemens Limited",
  APOLLOHOSP: "Apollo Hospitals",
  MAXHEALTH: "Max Healthcare",
  ABB: "ABB India",
  JIOFIN: "Jio Financial Services",
  LICI: "LIC of India"
};

const TrendingStocks = () => {
  const { trendingStocks } = useMarket();
  const navigate = useNavigate();

  const stocks = trendingStocks?.length
    ? trendingStocks.slice(0, 6) // Show exactly 6 cards to align cleanly in one row
    : Array.from({ length: 6 }, (_, index) => {
      const fallbackSymbols = ["DMART", "SIEMENS", "APOLLOHOSP", "MAXHEALTH", "ABB", "TMCV"];
      const fallbackPrices = [4182.80, 3728.90, 8267.00, 960.20, 7218.50, 365.30];
      const fallbackChanges = [3.10, 2.91, 2.19, 1.21, 1.01, -1.42];
      return {
        symbol: fallbackSymbols[index],
        price: fallbackPrices[index],
        change: fallbackChanges[index],
        company: companyNameMap[fallbackSymbols[index]]
      };
    });

  return (
    <div className="trending-section-wrapper">
      <div className="market-section-header">
        <div className="title-with-icon">
          <h2 className="market-section-title">Trending Stocks</h2>
        </div>
        <p className="market-section-subtitle">Most active equities by volume and trade count today</p>
      </div>

      <div className="trending-cards-grid">
        {stocks.map((stock, index) => {
          const changePercent = Number(stock.change ?? 0);
          const price = parseFloat(stock.price) || 0;
          const isPositive = changePercent >= 0;

          // Calculate absolute change in rupees
          const prevPrice = price / (1 + changePercent / 100);
          const absChange = price - prevPrice;

          const displayPrice = price === 0 || isNaN(price)
            ? "—"
            : `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

          const absVal = Math.abs(absChange).toFixed(2);
          const pctVal = Math.abs(changePercent).toFixed(2);
          const displayChange = price === 0 || isNaN(price)
            ? "—"
            : `${isPositive ? "" : "-"}${absVal} (${isPositive ? "" : "-"}${pctVal}%)`;

          const companyName = stock.company || companyNameMap[stock.symbol.toUpperCase()] || stock.symbol;

          return (
            <div
              key={`${stock.symbol}-${index}`}
              className="trending-stock-card clickable-card"
              onClick={() => navigate(`/stocks/${stock.symbol.toUpperCase()}`)}
            >
              <div className="trend-card-logo-wrap">
                <StockLogo symbol={stock.symbol} size={48} />
              </div>

              <span className="trend-company-name" title={companyName}>
                {companyName}
              </span>

              <span className="trend-card-price">
                {displayPrice}
              </span>

              <span className={`trend-card-change ${isPositive ? "positive" : "negative"}`}>
                {displayChange}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingStocks;