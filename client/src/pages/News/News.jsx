import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Newspaper, Clock, ExternalLink, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Compass, ShieldAlert, Award
} from "lucide-react";

// Format currency
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

// Static mock indices list for news sidebar
const mockIndices = [
  { name: "NIFTY 50", price: 22458.30, change: 184.20, pct: 0.83, isPositive: true },
  { name: "SENSEX", price: 73910.15, change: 590.10, pct: 0.81, isPositive: true },
  { name: "NIFTY BANK", price: 47920.40, change: -128.50, pct: -0.27, isPositive: false },
  { name: "NIFTY IT", price: 34812.90, change: 485.60, pct: 1.41, isPositive: true }
];

const mockArticles = [
  {
    id: 1,
    category: "Stocks",
    title: "Reliance Shares Hit Record High Following Retail Ventures Expansion Announcement",
    source: "Bloomberg Quint",
    time: "45 mins ago",
    summary: "Shares of Reliance Industries surged over 3.5% to hit an all-time high today. The market rally follows the company's board approval of a multi-billion dollar investment plan in its retail and green energy arms, boosting investor confidence.",
    author: "Rohan Sen",
    symbol: "RELIANCE",
    isFeatured: true,
  },
  {
    id: 2,
    category: "Economy",
    title: "India GDP Growth Beats Estimates, Rises to 7.8% in Q4 Citing Robust Manufacturing",
    source: "Economic Times",
    time: "2 hours ago",
    summary: "The Indian economy expanded at a faster-than-expected rate of 7.8% in the final quarter of the fiscal year, driven by strong manufacturing output and robust private consumption, solidifying India's position as the fastest-growing major economy.",
    author: "Pooja Mehta",
    symbol: null,
    isFeatured: false,
  },
  {
    id: 3,
    category: "Stocks",
    title: "Tata Steel Share Price Rallies as Global Steel Demand Forecasts Rise",
    source: "Moneycontrol",
    time: "4 hours ago",
    summary: "Tata Steel witnessed active buying in early trade after a global report predicted a recovery in European demand. Brokerage firms maintain a positive outlook with revised target prices for the metal major.",
    author: "Amit Verma",
    symbol: "TATASTEEL",
    isFeatured: false,
  },
  {
    id: 4,
    category: "Global Markets",
    title: "Nasdaq Futures Slide as US Federal Reserve Hints at Sustained High Interest Rates",
    source: "Reuters",
    time: "5 hours ago",
    summary: "Tech heavy Nasdaq futures fell in pre-market trade following Fed minutes showing policymakers remain concerned about inflation. Analysts suggest rate cuts might be delayed until late 2026.",
    author: "Sarah Jenkins",
    symbol: null,
    isFeatured: false,
  },
  {
    id: 5,
    category: "Corporate Actions",
    title: "Infosys Announces Final Dividend of ₹28 per Share Alongside Board Expansion",
    source: "Business Standard",
    time: "7 hours ago",
    summary: "IT bellwether Infosys announced a strong final dividend payout along with its earnings release. The firm also inducted new independent directors to support its cybersecurity and AI expansion roadmap.",
    author: "Vikram Malhotra",
    symbol: "INFY",
    isFeatured: false,
  },
  {
    id: 6,
    category: "Stocks",
    title: "State Bank of India Profit Beats Estimates, NII Grows by 14% Year-over-Year",
    source: "Livemint",
    time: "1 day ago",
    summary: "SBI reported a stellar net profit for the quarter, largely beating consensus estimates. Net Interest Income (NII) registered robust double-digit growth, while asset quality remained exceptionally stable.",
    author: "Ravi Teja",
    symbol: "SBIN",
    isFeatured: false,
  }
];

const News = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All News");

  // Filtering logic
  const filteredArticles = useMemo(() => {
    if (activeCategory === "All News") return mockArticles;
    return mockArticles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory]);

  const featuredArticle = useMemo(() => {
    // Find featured article in active filter or default to first
    const feat = filteredArticles.find(a => a.isFeatured);
    return feat || filteredArticles[0];
  }, [filteredArticles]);

  const regularArticles = useMemo(() => {
    if (!featuredArticle) return [];
    return filteredArticles.filter(a => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle]);

  return (
    <div className="news-page-container">
      {/* 2-COLUMN VIEWPORT LAYOUT */}
      <div className="news-grid-wrapper">

        {/* LEFT COLUMN: ARTICLES STREAM */}
        <div className="news-articles-main-column">

          {/* Page Hero Header */}
          <div className="news-hero-title-card">
            <div className="hero-left">
              <div className="hero-title-row">
                <h1>Market Insights</h1>
              </div>
              <p>Real-time financial journalism, corporate announcements, and macroeconomic reports</p>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="news-categories-tabs-bar">
            {["All News", "Stocks", "Economy", "Global Markets", "Corporate Actions"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-tab-btn ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Article Card */}
          {featuredArticle && (
            <div className="featured-news-card">
              <div className="featured-card-body">
                <div className="article-meta-row">
                  <span className="category-badge">{featuredArticle.category}</span>
                  <span className="dot">•</span>
                  <span className="time-badge">
                    <Clock size={11} className="inline mr-1" />
                    {featuredArticle.time}
                  </span>
                </div>

                <h2 className="featured-title">{featuredArticle.title}</h2>
                <p className="featured-summary">{featuredArticle.summary}</p>

                <div className="featured-footer">
                  <span className="source-label">Source: {featuredArticle.source}</span>

                  {featuredArticle.symbol && (
                    <button
                      onClick={() => navigate(`/stocks/${featuredArticle.symbol.toUpperCase()}`)}
                      className="nav-to-stock-btn"
                    >
                      Trade {featuredArticle.symbol}
                      <ArrowUpRight size={13} className="ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Regular Articles Stream */}
          <div className="news-articles-list">
            {regularArticles.length > 0 ? (
              regularArticles.map((article) => (
                <div key={article.id} className="news-row-card">
                  <div className="news-row-body">
                    <div className="article-meta-row">
                      <span className="category-badge-simple">{article.category}</span>
                      <span className="dot">•</span>
                      <span className="source-label">{article.source}</span>
                      <span className="dot">•</span>
                      <span className="time-badge">
                        <Clock size={11} className="inline mr-1" />
                        {article.time}
                      </span>
                    </div>

                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-summary-simple">{article.summary}</p>

                    {article.symbol && (
                      <div className="article-actions-row">
                        <button
                          onClick={() => navigate(`/stocks/${article.symbol.toUpperCase()}`)}
                          className="trade-stock-tag-btn"
                        >
                          {article.symbol} NSE
                          <ArrowUpRight size={11} className="ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="news-empty-state">
                <span>No secondary stories in this category.</span>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: SIDEBAR WIDGETS */}
        <aside className="news-sidebar-column">

          {/* Live market indices widget */}
          <div className="news-sidebar-widget">
            <h3 className="widget-title">Market Indicators</h3>
            <div className="indices-list-group">
              {mockIndices.map((ind, idx) => (
                <div key={idx} className="index-row-item">
                  <div className="index-meta">
                    <span className="index-name">{ind.name}</span>
                    <span className="index-price">{ind.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className={`index-change ${ind.isPositive ? "up" : "down"}`}>
                    {ind.isPositive ? (
                      <ArrowUpRight size={13} className="mr-0.5" />
                    ) : (
                      <ArrowDownRight size={13} className="mr-0.5" />
                    )}
                    <span>
                      {ind.isPositive ? "+" : ""}
                      {ind.pct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Disclaimer */}
          <div className="news-sidebar-widget disclaimer-widget">
            <div className="flex items-start gap-2 text-amber-600 mb-2">
              <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Trading Disclaimer</h4>
            </div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              All market news, data feeds, and pricing values are compiled for virtual simulation purposes. TradeXpert does not facilitate real-exchange capital placements.
            </p>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default News;