import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TransparentLogo from "../../components/ui/TransparentLogo";
import { useMarket } from "../../context/MarketContext";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import {
  LineChart, Line, ResponsiveContainer
} from "recharts";
import StockLogo from "../../components/ui/StockLogo";
import {
  ArrowUpRight, Shield, Award, Activity, Wallet, Star, ChevronDown, Cpu, Check
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { marketStocks, indices } = useMarket();
  const { user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "N";
  const userFullName = user?.name || "Niraj Kotadiya";

  const formatIndexValue = (val) => {
    if (!val) return "—";
    const cleanStr = String(val).replace(/[₹,]/g, "").trim();
    const num = Number(cleanStr);
    if (isNaN(num)) return val;
    return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const features = [
    {
      icon: <Activity />,
      title: "Virtual Trading",
      description: "Trade Nifty 50 stocks in a risk-free simulator matching real-exchange order execution rules.",
    },
    {
      icon: <Wallet />,
      title: "Portfolio Analytics",
      description: "Gain rich insights with performance charts, holdings distribution, and average purchase tracking.",
    },
    {
      icon: <Cpu />,
      title: "Live Market Tracking",
      description: "Monitor stock prices, index fluctuations, and market feeds synced via real-time WebSockets.",
    },
    {
      icon: <Star />,
      title: "Smart Watchlists",
      description: "Create personalized watchlists to flag your favorite stocks and quickly observe trends.",
    },
    {
      icon: <Shield />,
      title: "Zero Capital Risk",
      description: "Get ₹10 Lakhs in virtual cash on sign up to test, validate, and master new trading strategies.",
    },
    {
      icon: <Award />,
      title: "Real-time Financial News",
      description: "Integrate live RSS stock news from leading sources parsed directly into your detail views.",
    },
  ];

  const faqs = [
    {
      q: "What is TradeXpert and is it free?",
      a: "TradeXpert is a modern, virtual stock trading simulator designed to replicate the Indian stock market. It is 100% free. You receive a virtual cash balance of ₹10,00,000 upon registration to practice trading risk-free."
    },
    {
      q: "Are the stock prices real-time?",
      a: "Yes! TradeXpert features a live WebSocket feed connected to the market routes. All index movements and major stock prices tick dynamically during trading hours."
    },
    {
      q: "Can I withdraw my earnings/balance?",
      a: "No. TradeXpert is a virtual trading simulator for training and education purposes. All balances, holdings, and transactions are strictly virtual and do not involve real money or security placements."
    },
    {
      q: "What happens to pending orders at the end of the day?",
      a: "In line with standard exchange rules, any pending limit orders that are not filled during trading hours are automatically cancelled at the end of the day to keep your order book clean."
    }
  ];

  // Infinite ticker items mapping
  const tickerStocks = useMemo(() => {
    const list = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "TATASTEEL", "TATAMOTORS"];
    return list.map(sym => {
      const live = marketStocks?.find(s => s.symbol.toUpperCase() === sym);
      return {
        symbol: sym,
        price: live ? parseFloat(live.price) : 1000.00,
        change: live ? parseFloat(live.change) : 0.00
      };
    });
  }, [marketStocks]);

  // Trending stocks list with sparkline generator
  const trendingStocks = useMemo(() => {
    const symbols = ["RELIANCE", "TCS", "INFY", "SBIN"];
    return symbols.map(sym => {
      const live = marketStocks?.find(s => s.symbol.toUpperCase() === sym);
      const price = live ? parseFloat(live.price) : (sym === "RELIANCE" ? 2540.00 : sym === "TCS" ? 3420.00 : sym === "INFY" ? 1490.00 : 820.00);
      const change = live ? parseFloat(live.change) : 1.25;

      // Seed sparkline values
      let hash = 0;
      for (let i = 0; i < sym.length; i++) {
        hash = sym.charCodeAt(i) + ((hash << 5) - hash);
      }
      const sparkData = [];
      let tempPrice = price - (change * (price / 100));
      for (let i = 0; i < 8; i++) {
        const seed = Math.sin(hash + i) * 0.4;
        tempPrice = tempPrice * (1 + seed / 100);
        sparkData.push({ price: tempPrice });
      }
      sparkData.push({ price }); // last point exact

      return {
        symbol: sym,
        name: live?.company || `${sym} Industries Ltd`,
        price,
        change,
        sparkData
      };
    });
  }, [marketStocks]);

  // Main Indices matching logic
  const orderedNames = ["NIFTY 50", "SENSEX", "BANK NIFTY", "FIN NIFTY"];
  const indexCards = useMemo(() => {
    return orderedNames.map((name) => {
      let found = indices?.find((item) => item.name?.toUpperCase() === name);
      if (!found) {
        found = indices?.find((item) => {
          const itemUpper = item.name?.toUpperCase() || "";
          if (name === "BANK NIFTY" && (itemUpper === "NIFTY BANK" || itemUpper === "BANKNIFTY")) return true;
          if (name === "FIN NIFTY" && (itemUpper === "NIFTY FIN SERVICE" || itemUpper === "NIFTY FIN" || itemUpper === "FINNIFTY")) return true;
          return false;
        });
      }
      if (found) {
        return { name, value: found.value, change: found.change ?? 0 };
      }
      const defaults = {
        "NIFTY 50": { value: "24850.00", change: 1.25 },
        "SENSEX": { value: "81240.00", change: 0.84 },
        "BANK NIFTY": { value: "52100.00", change: -0.42 },
        "FIN NIFTY": { value: "23150.00", change: 0.35 },
      };
      return { name, value: defaults[name]?.value ?? "—", change: defaults[name]?.change ?? 0 };
    });
  }, [indices]);



  return (
    <div className="landing-page-container">

      {/* HEADER NAVBAR */}
      <Navbar />

      {/* INFINITE RUNNING TICKER RIBBON */}
      <div className="landing-ticker-ribbon">
        <div className="landing-ticker-track">
          {[1, 2, 3].map((copyIndex) => (
            <div key={`copy-${copyIndex}`} className="landing-ticker-set">
              {tickerStocks.map((stock, sIdx) => {
                const isPos = stock.change >= 0;
                return (
                  <div key={`${stock.symbol}-${copyIndex}-${sIdx}`} className="landing-ticker-item" onClick={() => navigate(`/stocks/${stock.symbol}`)}>
                    <span className="ticker-name">{stock.symbol}</span>
                    <span className="ticker-price">₹{Number(stock.price).toFixed(2)}</span>
                    <span className={`ticker-change ${isPos ? "up" : "down"}`}>
                      {isPos ? "+" : ""}{Number(stock.change).toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <header className="landing-hero-section">
        {/* Background Decorative Grid and Glows */}
        <div className="hero-grid-overlay"></div>
        <div className="hero-glow-orb orb-1"></div>
        <div className="hero-glow-orb orb-2"></div>

        <div className="landing-hero-grid">
          {/* LEFT SIDE: Hero copy & action checklist */}
          <div className="landing-hero-left">
            <h1 className="landing-hero-title">
              Trade Smart. Invest Better. <span>Master the Markets.</span>
            </h1>

            <p className="landing-hero-subtitle">
              Experience real-time stock trading simulation integrated with advanced portfolio insights, technical indicators, and real financial news feeds. Overcome market volatility risk-free.
            </p>

            <div className="landing-hero-actions">
              <button onClick={() => navigate("/register")} className="landing-btn-primary-glowing">
                Get Started Free <ArrowUpRight size={16} style={{ marginLeft: "6px" }} />
              </button>
              <button onClick={() => navigate("/markets")} className="landing-btn-secondary-flat">
                Explore Live Feed
              </button>
            </div>

            <div className="landing-hero-features-banner">
              <div className="banner-item">
                <span className="banner-check"><Check size={12} /></span>
                <span>₹10 Lakhs Virtual Cash</span>
              </div>
              <div className="banner-divider"></div>
              <div className="banner-item">
                <span className="banner-check"><Check size={12} /></span>
                <span>Live WebSockets Sync</span>
              </div>
              <div className="banner-divider"></div>
              <div className="banner-item">
                <span className="banner-check"><Check size={12} /></span>
                <span>Advanced Portfolio Analytics</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Live indices cards & quick lookup list */}
          <div className="landing-hero-right">
            <div className="hero-indices-panel">
              <div className="panel-header">
                <h3>Live Market Indices</h3>
                <span className="live-pill">
                  <span className="pulse-dot"></span> Live
                </span>
              </div>

              <div className="indices-list">
                {indexCards.map((card) => {
                  const isPos = card.change >= 0;
                  return (
                    <div key={card.name} className="index-card-item" onClick={() => navigate("/markets")}>
                      <div className="index-info">
                        <span className="index-name">{card.name}</span>
                        <span className="index-value">
                          {formatIndexValue(card.value)}
                        </span>
                      </div>
                      <div className={`index-change ${isPos ? "up" : "down"}`}>
                        {isPos ? "▲ " : "▼ "}{isPos ? "+" : ""}{Number(card.change).toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick stock lookup preview */}
              <div className="quick-lookup-card">
                <div className="lookup-header">
                  <span>Quick Equities Lookup</span>
                  <span className="view-all-link" onClick={() => navigate("/markets")}>View Markets →</span>
                </div>
                <div className="quick-stocks-list">
                  {tickerStocks.slice(0, 3).map((stock) => {
                    const isPos = stock.change >= 0;
                    return (
                      <div key={stock.symbol} className="quick-stock-row" onClick={() => navigate(`/stocks/${stock.symbol}`)}>
                        <span className="sym">{stock.symbol}</span>
                        <span className="price">₹{Number(stock.price).toFixed(2)}</span>
                        <span className={`change ${isPos ? "up" : "down"}`}>
                          {isPos ? "+" : ""}{Number(stock.change).toFixed(2)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* LIVE TRENDING STOCKS SECTION */}
      <section className="landing-trending-section">
        <div className="landing-section-header">
          <h2>Trending Stocks Today</h2>
          <p>Instant tracking of hot market equities. Click any stock to view detailed analytics.</p>
        </div>

        <div className="landing-trending-grid">
          {trendingStocks.map((stock) => {
            const isPos = stock.change >= 0;
            return (
              <div
                key={stock.symbol}
                className="landing-trending-card"
                onClick={() => navigate(`/stocks/${stock.symbol}`)}
              >
                <div className="card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <StockLogo symbol={stock.symbol} size={28} />
                    <div className="stock-info">
                      <span className="symbol">{stock.symbol}</span>
                      <span className="company">{stock.name}</span>
                    </div>
                  </div>
                  <div className={`change-badge ${isPos ? "up" : "down"}`}>
                    {isPos ? "+" : ""}{stock.change.toFixed(2)}%
                  </div>
                </div>

                <div className="card-body">
                  <div className="price-info">
                    <span className="price-label">Last Traded Price</span>
                    <span className="price-value">₹{stock.price.toFixed(2)}</span>
                  </div>
                  <div className="sparkline-wrapper">
                    <div style={{ width: "100px", height: "35px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stock.sparkData}>
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={isPos ? "#00b074" : "#ff4d4d"}
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="action-link">Open Trading View <ArrowUpRight size={14} className="inline ml-1" /></span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY TRADEXPERT FEATURES SECTION */}
      <section className="landing-features-section">
        <div className="landing-section-header">
          <h2>Powerful Simulation Features</h2>
          <p>Practice, study, and fine-tune your stock trading models risk-free.</p>
        </div>

        <div className="landing-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="landing-feature-card">
              <div className="landing-feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS TIMELINE */}
      <section className="landing-workflow-section">
        <div className="landing-section-header">
          <h2>How TradeXpert Works</h2>
          <p>Get started in under two minutes with these quick steps.</p>
        </div>

        <div className="landing-workflow-grid">
          {[
            { step: "01", title: "Create Your Account", desc: "Sign up instantly with your virtual credentials. No bank account required." },
            { step: "02", title: "Obtain Virtual Cash", desc: "Receive ₹10 Lakhs in virtual currency placed directly into your portfolio." },
            { step: "03", title: "Execute Live Trades", desc: "Place buy/sell market and limit orders synced with real Indian stock quotes." },
            { step: "04", title: "Track Performance", desc: "Review detailed profit and loss statements and trade history analytics." }
          ].map((item, idx) => (
            <div key={idx} className="landing-workflow-node">
              <div className="node-step-number">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              {idx < 3 && <div className="node-connector-line"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ INTERACTIVE ACCORDION */}
      <section className="landing-faq-section">
        <div className="landing-section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common platform mechanics and trading questions.</p>
        </div>

        <div className="landing-faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`landing-faq-item ${isOpen ? "open" : ""}`}
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
              >
                <div className="faq-question-row">
                  <h3>{faq.q}</h3>
                  <ChevronDown size={18} className="arrow-icon" />
                </div>
                {isOpen && (
                  <div className="faq-answer-row">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer-section">
        <div className="landing-footer-content">
          <div className="landing-footer-left">
            <TransparentLogo className="landing-logo" alt="TradeXpert" style={{ height: "34px" }} />
            <p className="description">
              TradeXpert is a virtual paper trading system created for simulation, education, and strategy testing. We do not place real-exchange trades or handle security assets.
            </p>
          </div>

          <div className="landing-footer-right">
            <div className="landing-footer-column">
              <h3>Platform</h3>
              <p onClick={() => navigate("/markets")}>Markets</p>
              <p onClick={() => navigate("/portfolio")}>Portfolio</p>
              <p onClick={() => navigate("/trading")}>Trading</p>
              <p onClick={() => navigate("/news")}>News</p>
            </div>

            <div className="landing-footer-column">
              <h3>Resources</h3>
              <p onClick={() => navigate("/resources/trading-rules")}>Trading Rules</p>
              <p onClick={() => navigate("/resources/technical-guides")}>Technical Guides</p>
              <p onClick={() => navigate("/resources/privacy")}>Privacy Policy</p>
              <p onClick={() => navigate("/resources/terms")}>Terms of Use</p>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          © 2026 TradeXpert Simulator. All virtual assets, logic, and quotes compiled for educational placements.
        </div>
      </footer>

    </div>
  );
};

export default Home;