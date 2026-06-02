import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";

import {
  FaChartLine,
  FaChartPie,
  FaSignal,
  FaStar,
  FaShieldAlt,
  FaWallet,
  FaArrowUp,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const { indices } = useMarket();

  const stats = [
    { number: "50K+", title: "Active Traders" },
    { number: "₹120Cr+", title: "Virtual Trades" },
    { number: "99.9%", title: "Platform Uptime" },
    { number: "24/7", title: "Market Insights" },
  ];

  const features = [
    {
      icon: <FaChartLine />,
      title: "Virtual Trading",
      description: "Practice stock trading with realistic market simulation and live execution.",
    },
    {
      icon: <FaChartPie />,
      title: "Portfolio Analytics",
      description: "Track investments using advanced analytics and modern financial insights.",
    },
    {
      icon: <FaSignal />,
      title: "Live Market Tracking",
      description: "Monitor real-time stock prices, market trends, and trading movements.",
    },
    {
      icon: <FaStar />,
      title: "Smart Watchlists",
      description: "Create personalized watchlists and monitor your favorite stocks easily.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Analysis",
      description: "Understand investment risk and make smarter financial decisions.",
    },
    {
      icon: <FaWallet />,
      title: "Advanced Dashboard",
      description: "Experience a premium fintech dashboard with charts and analytics.",
    },
  ];

  const orderedNames = ["NIFTY 50", "SENSEX", "BANK NIFTY", "FIN NIFTY"];

  const cards = orderedNames.map((name) => {
    let found = indices?.find((item) => item.name?.toUpperCase() === name);
    if (!found) {
      found = indices?.find((item) => {
        const itemUpper = item.name?.toUpperCase() || "";
        if (name === "BANK NIFTY" && (itemUpper === "NIFTY BANK" || itemUpper === "BANKNIFTY")) {
          return true;
        }
        if (name === "FIN NIFTY" && (itemUpper === "NIFTY FIN SERVICE" || itemUpper === "NIFTY FIN" || itemUpper === "FINNIFTY")) {
          return true;
        }
        return false;
      });
    }

    if (found) {
      return {
        name,
        value: found.value,
        change: found.change ?? 0,
      };
    }

    const defaults = {
      "NIFTY 50": { value: "24,850.00", change: 1.25 },
      "SENSEX": { value: "81,240.00", change: 0.84 },
      "BANK NIFTY": { value: "52,100.00", change: -0.42 },
      "FIN NIFTY": { value: "23,150.00", change: 0.35 },
    };

    return {
      name,
      value: defaults[name]?.value ?? "—",
      change: defaults[name]?.change ?? 0,
    };
  });

  return (
    <div className="landing-page-container">
      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="landing-navbar-left" onClick={() => navigate("/")}>
          <img src={logo} alt="TradeXpert" className="landing-logo" />
        </div>

        <div className="landing-navbar-center">
          <button onClick={() => navigate("/markets")} className="landing-nav-link">Markets</button>
          <button onClick={() => navigate("/portfolio")} className="landing-nav-link">Portfolio</button>
          <button onClick={() => navigate("/trading")} className="landing-nav-link">Trading</button>
          <button onClick={() => navigate("/news")} className="landing-nav-link">News</button>
        </div>

        <div className="landing-navbar-right">
          <button onClick={() => navigate("/login")} className="landing-btn-text">Sign In</button>
          <button onClick={() => navigate("/register")} className="landing-btn-primary">Get Started</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="landing-hero-section">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Trade Smart.<br />
            Invest Better.<br />
            <span>Master The</span> Market.
          </h1>
          <p className="landing-hero-subtitle">
            Experience real-time Indian stock market simulation with portfolio analytics, market insights, live trends, and advanced trading tools — all in one premium fintech platform.
          </p>

          <div className="landing-hero-actions">
            <button onClick={() => navigate("/register")} className="landing-btn-primary">Start Trading</button>
            <button onClick={() => navigate("/markets")} className="landing-btn-secondary">Explore Market</button>
          </div>

          <div className="landing-hero-stats">
            {stats.map((item, index) => (
              <div key={index} className="landing-stat-item">
                <h3>{item.number}</h3>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT DASHBOARD PREVIEW */}
        <div className="landing-hero-mockup">
          <div className="landing-mockup-card">
            <div className="landing-mockup-header">
              <div>
                <h2>Market Overview</h2>
                <p>Real-time analytics dashboard</p>
              </div>
              <span className="landing-live-badge">Live Market</span>
            </div>

            <div className="landing-mockup-portfolio">
              <div className="landing-portfolio-bg-circle"></div>
              <div className="landing-portfolio-header">
                <div>
                  <span className="landing-portfolio-label">Portfolio Value</span>
                  <h2 className="landing-portfolio-value">₹4,25,320</h2>
                </div>
                <span className="landing-portfolio-badge">
                  <FaArrowUp size={10} /> 12.4%
                </span>
              </div>

              {/* simulated graph w/ bars */}
              <div className="landing-mockup-chart">
                <div className="landing-chart-bar" style={{ height: "45%" }}></div>
                <div className="landing-chart-bar" style={{ height: "60%" }}></div>
                <div className="landing-chart-bar" style={{ height: "75%" }}></div>
                <div className="landing-chart-bar" style={{ height: "55%" }}></div>
                <div className="landing-chart-bar active-green" style={{ height: "85%" }}></div>
                <div className="landing-chart-bar" style={{ height: "50%" }}></div>
                <div className="landing-chart-bar active-teal" style={{ height: "95%" }}></div>
                <div className="landing-chart-bar" style={{ height: "70%" }}></div>
              </div>
            </div>

            {/* REAL-TIME INDICES CARDS */}
            <div className="landing-mockup-indices">
              {cards.map((item, index) => {
                const change = typeof item.change === "number" ? item.change : parseFloat(item.change) || 0;
                const isPositive = change >= 0;

                let displayValue = item.value;
                if (typeof displayValue === "number") {
                  displayValue = `₹${displayValue.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`;
                } else if (typeof displayValue === "string") {
                  const cleanString = displayValue.replace(/[₹,]/g, "");
                  const num = parseFloat(cleanString);
                  if (!isNaN(num)) {
                    displayValue = `₹${num.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;
                  } else {
                    if (displayValue !== "—" && !displayValue.startsWith("₹")) {
                      displayValue = `₹${displayValue}`;
                    }
                  }
                }

                return (
                  <div key={`${item.name}-${index}`} className="landing-index-item">
                    <div className="landing-index-top">
                      <span className="landing-index-name">{item.name}</span>
                      <span className={`landing-index-pct ${isPositive ? "up" : "down"}`}>
                        {isPositive ? "+" : ""}{change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="landing-index-val">{displayValue}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="landing-features-section">
        <div className="landing-features-header">
          <h2>Powerful Trading Features</h2>
          <p>Everything you need to learn, practice, and master trading.</p>
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

      {/* CTA SECTION */}
      <section className="landing-cta-section">
        <div className="landing-cta-banner">
          <h2>Start Your Trading Journey Today</h2>
          <p>
            Join thousands of traders using TradeXpert to practice, analyze, and master stock market trading with modern fintech tools.
          </p>
          <button onClick={() => navigate("/register")} className="landing-cta-btn">
            Get Started Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer-section">
        <div className="landing-footer-content">
          <div className="landing-footer-left">
            <img src={logo} alt="TradeXpert" className="landing-logo" />
            <p>
              TradeXpert is a modern virtual trading platform helping traders learn stock market investing using advanced analytics, real-time insights, and fintech tools.
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
              <p>Documentation</p>
              <p>Support</p>
              <p>Privacy Policy</p>
              <p>Terms & Conditions</p>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          © 2026 TradeXpert. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;