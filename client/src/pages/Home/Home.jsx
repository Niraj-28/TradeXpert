import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useMarket } from "../../context/MarketContext";
import { useState, useEffect } from "react";

import {
  FaChartLine,
  FaChartPie,
  FaSignal,
  FaStar,
  FaShieldAlt,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaCheck,
  FaPlay,
  FaBolt,
  FaGlobe,
  FaLock,
  FaTrophy,
} from "react-icons/fa";
import { FiTrendingUp, FiTrendingDown, FiActivity } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();
  const { indices } = useMarket();
  const [scrolled, setScrolled] = useState(false);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTicker((p) => p + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { number: "50K+", title: "Active Traders", icon: <FaTrophy /> },
    { number: "₹120Cr+", title: "Virtual Volume", icon: <FaChartLine /> },
    { number: "99.9%", title: "Platform Uptime", icon: <FaBolt /> },
    { number: "24/7", title: "Market Insights", icon: <FaGlobe /> },
  ];

  const features = [
    {
      icon: <FaChartLine />,
      title: "Virtual Trading",
      description: "Practice stock trading with realistic market simulation and live order execution at real prices.",
      badge: "Core",
    },
    {
      icon: <FaChartPie />,
      title: "Portfolio Analytics",
      description: "Track P&L, holdings, and investment performance with advanced analytics and rich visual charts.",
      badge: "Analytics",
    },
    {
      icon: <FaSignal />,
      title: "Live Market Data",
      description: "Monitor real-time NSE/BSE indices, stock prices, and market movements via WebSocket streams.",
      badge: "Real-time",
    },
    {
      icon: <FaStar />,
      title: "Smart Watchlists",
      description: "Create personalized watchlists and get instant alerts on your favorite stocks.",
      badge: "Watchlist",
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Analysis",
      description: "Understand market exposure and make smarter risk-adjusted investment decisions.",
      badge: "Risk",
    },
    {
      icon: <FaWallet />,
      title: "₹10L Virtual Cash",
      description: "Start with ₹10 lakh in virtual capital. Practice freely — no real money at stake.",
      badge: "Free",
    },
  ];

  const orderedNames = ["NIFTY 50", "SENSEX", "BANK NIFTY", "FIN NIFTY"];

  const cards = orderedNames.map((name) => {
    let found = indices?.find((item) => item.name?.toUpperCase() === name);
    if (!found) {
      found = indices?.find((item) => {
        const u = item.name?.toUpperCase() || "";
        if (name === "BANK NIFTY" && (u === "NIFTY BANK" || u === "BANKNIFTY")) return true;
        if (name === "FIN NIFTY" && (u === "NIFTY FIN SERVICE" || u === "NIFTY FIN" || u === "FINNIFTY")) return true;
        return false;
      });
    }
    if (found) {
      return { name, value: found.value, change: found.change ?? 0 };
    }
    const defaults = {
      "NIFTY 50": { value: "23,525.05", change: -0.09 },
      SENSEX: { value: "74,716.14", change: -0.08 },
      "BANK NIFTY": { value: "53,926.10", change: -0.58 },
      "FIN NIFTY": { value: "25,150.70", change: -0.80 },
    };
    return { name, value: defaults[name]?.value ?? "—", change: defaults[name]?.change ?? 0 };
  });

  const formatValue = (v) => {
    if (typeof v === "number") {
      return `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const clean = String(v).replace(/[₹,]/g, "");
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return v;
  };

  const testimonials = [
    { name: "Arjun S.", role: "Final Year Student", text: "TradeXpert helped me understand markets without risking a single rupee. The live data is incredible." },
    { name: "Priya M.", role: "Software Engineer", text: "Best virtual trading platform I've used. The portfolio analytics are on par with real trading apps." },
    { name: "Rahul K.", role: "Finance Graduate", text: "The UI is stunning and the real-time WebSocket data makes it feel like actual trading." },
  ];

  return (
    <div className="lp-root">
      {/* ── NAVBAR ── */}
      <nav className={`lp-nav ${scrolled ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav__logo" onClick={() => navigate("/")}>
          <img src={logo} alt="TradeXpert" />
        </div>
        <div className="lp-nav__links">
          <button onClick={() => navigate("/markets")} className="lp-nav__link">Markets</button>
          <button onClick={() => navigate("/portfolio")} className="lp-nav__link">Portfolio</button>
          <button onClick={() => navigate("/trading")} className="lp-nav__link">Trading</button>
          <button onClick={() => navigate("/news")} className="lp-nav__link">News</button>
        </div>
        <div className="lp-nav__actions">
          <button onClick={() => navigate("/login")} className="lp-btn-ghost">Sign In</button>
          <button onClick={() => navigate("/register")} className="lp-btn-primary">Start Free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        {/* background decorations */}
        <div className="lp-hero__bg-glow lp-hero__bg-glow--1" />
        <div className="lp-hero__bg-glow lp-hero__bg-glow--2" />
        <div className="lp-hero__grid-overlay" />

        <div className="lp-hero__left">
          <div className="lp-hero__badge">
            <FiActivity size={12} />
            <span>Live NSE · BSE Market Data</span>
          </div>

          <h1 className="lp-hero__headline">
            Trade Smart.<br />
            Invest Better.<br />
            <span className="lp-hero__headline--accent">Master</span> The Market.
          </h1>

          <p className="lp-hero__sub">
            India's most advanced virtual stock market platform. Practice trading with real-time NSE/BSE data, powerful analytics, and a ₹10L virtual portfolio — completely risk-free.
          </p>

          <div className="lp-hero__cta-row">
            <button onClick={() => navigate("/register")} className="lp-btn-primary lp-btn-primary--lg">
              <FaPlay size={11} /> Start Trading Free
            </button>
            <button onClick={() => navigate("/markets")} className="lp-btn-outline--dark">
              Explore Markets
            </button>
          </div>

          <div className="lp-hero__trust">
            <div className="lp-hero__trust-avatars">
              {["A", "P", "R", "S", "N"].map((l, i) => (
                <span key={i} className="lp-hero__avatar" style={{ zIndex: 5 - i }}>{l}</span>
              ))}
            </div>
            <p><strong>50,000+</strong> traders already onboard</p>
          </div>
        </div>

        <div className="lp-hero__right">
          {/* Dashboard mockup card */}
          <div className="lp-mockup">
            <div className="lp-mockup__header">
              <div>
                <h2>Live Market Overview</h2>
                <p>Real-time analytics · NSE / BSE</p>
              </div>
              <span className="lp-live-dot"><span className="lp-live-dot__pulse" />LIVE</span>
            </div>

            {/* portfolio strip */}
            <div className="lp-mockup__portfolio">
              <div className="lp-mockup__portfolio-bg" />
              <div className="lp-mockup__portfolio-left">
                <span className="lp-mockup__portfolio-label">Portfolio Value</span>
                <h2 className="lp-mockup__portfolio-val">₹4,25,320</h2>
              </div>
              <div className="lp-mockup__portfolio-right">
                <span className="lp-badge-green"><FaArrowUp size={9} /> +12.4%</span>
                <p className="lp-mockup__portfolio-since">vs last month</p>
              </div>
              {/* mini chart bars */}
              <div className="lp-mini-chart">
                {[45, 60, 50, 75, 55, 85, 50, 95, 70, 80].map((h, i) => (
                  <div key={i} className={`lp-mini-bar ${i === 7 || i === 9 ? "lp-mini-bar--accent" : ""}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* indices grid */}
            <div className="lp-mockup__indices">
              {cards.map((item, idx) => {
                const change = typeof item.change === "number" ? item.change : parseFloat(item.change) || 0;
                const pos = change >= 0;
                return (
                  <div key={idx} className={`lp-idx-card ${pos ? "lp-idx-card--up" : "lp-idx-card--down"}`}>
                    <div className="lp-idx-card__top">
                      <span className="lp-idx-card__name">{item.name}</span>
                      <span className={`lp-idx-card__pct ${pos ? "up" : "down"}`}>
                        {pos ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
                        {pos ? "+" : ""}{change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="lp-idx-card__val">{formatValue(item.value)}</div>
                  </div>
                );
              })}
            </div>

            {/* quick trade strip */}
            <div className="lp-mockup__trade-strip">
              <div className="lp-trade-chip lp-trade-chip--buy">BUY · RELIANCE</div>
              <div className="lp-trade-chip lp-trade-chip--sell">SELL · TCS</div>
              <div className="lp-trade-chip lp-trade-chip--watch">WATCH · INFY</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="lp-stats-band">
        <div className="lp-stats-band__inner">
          {stats.map((s, i) => (
            <div key={i} className="lp-stat">
              <div className="lp-stat__icon">{s.icon}</div>
              <h3 className="lp-stat__num">{s.number}</h3>
              <p className="lp-stat__label">{s.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features">
        <div className="lp-features__inner">
          <div className="lp-section-head">
            <span className="lp-section-head__eyebrow">Platform Features</span>
            <h2 className="lp-section-head__title">Everything You Need to Trade</h2>
            <p className="lp-section-head__sub">A complete fintech suite built for Indian stock markets.</p>
          </div>

          <div className="lp-features__grid">
            {features.map((f, i) => (
              <div key={i} className="lp-feat-card">
                <div className="lp-feat-card__top">
                  <div className="lp-feat-card__icon">{f.icon}</div>
                  <span className="lp-feat-card__badge">{f.badge}</span>
                </div>
                <h3 className="lp-feat-card__title">{f.title}</h3>
                <p className="lp-feat-card__desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-how">
        <div className="lp-how__inner">
          <div className="lp-section-head lp-section-head--dark">
            <span className="lp-section-head__eyebrow lp-section-head__eyebrow--mint">How It Works</span>
            <h2 className="lp-section-head__title lp-section-head__title--white">Start Trading in 3 Steps</h2>
            <p className="lp-section-head__sub lp-section-head__sub--muted">Simple. Fast. Zero risk.</p>
          </div>

          <div className="lp-steps">
            {[
              { step: "01", title: "Create Account", desc: "Sign up for free. No credit card required.", icon: <FaLock /> },
              { step: "02", title: "Get ₹10L Capital", desc: "Receive virtual cash and start exploring markets instantly.", icon: <FaWallet /> },
              { step: "03", title: "Trade & Analyse", desc: "Place orders, track P&L, and sharpen your trading skills.", icon: <FaChartLine /> },
            ].map((s, i) => (
              <div key={i} className="lp-step">
                <div className="lp-step__num">{s.step}</div>
                <div className="lp-step__icon">{s.icon}</div>
                <h3 className="lp-step__title">{s.title}</h3>
                <p className="lp-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lp-testimonials">
        <div className="lp-testimonials__inner">
          <div className="lp-section-head">
            <span className="lp-section-head__eyebrow">Testimonials</span>
            <h2 className="lp-section-head__title">Loved by Traders</h2>
          </div>
          <div className="lp-testimonials__grid">
            {testimonials.map((t, i) => (
              <div key={i} className="lp-testimonial-card">
                <div className="lp-testimonial-card__stars">
                  {[...Array(5)].map((_, si) => <FaStar key={si} size={12} />)}
                </div>
                <p className="lp-testimonial-card__text">"{t.text}"</p>
                <div className="lp-testimonial-card__author">
                  <div className="lp-testimonial-card__avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-cta">
        <div className="lp-cta__inner">
          <div className="lp-cta__glow" />
          <span className="lp-section-head__eyebrow lp-section-head__eyebrow--mint">Get Started Today</span>
          <h2 className="lp-cta__title">Your Trading Journey Begins Here</h2>
          <p className="lp-cta__sub">
            Join 50,000+ traders practising with TradeXpert's real-time NSE & BSE data, advanced analytics, and zero-risk virtual capital.
          </p>
          <div className="lp-cta__checks">
            {["Free to join, no card needed", "₹10 Lakh virtual capital", "Real NSE / BSE live prices", "Advanced portfolio analytics"].map((c, i) => (
              <div key={i} className="lp-cta__check">
                <FaCheck size={10} /> {c}
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/register")} className="lp-btn-primary lp-btn-primary--lg lp-cta__btn">
            Create Free Account
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <img src={logo} alt="TradeXpert" className="lp-footer__logo" />
            <p>
              India's most advanced virtual stock market trading platform. Practice with live NSE & BSE prices, build skills, and invest with confidence.
            </p>
          </div>

          <div className="lp-footer__cols">
            <div className="lp-footer__col">
              <h4>Platform</h4>
              {[["Markets", "/markets"], ["Portfolio", "/portfolio"], ["Trading", "/trading"], ["News", "/news"]].map(([l, r]) => (
                <button key={l} onClick={() => navigate(r)} className="lp-footer__link">{l}</button>
              ))}
            </div>
            <div className="lp-footer__col">
              <h4>Account</h4>
              {[["Sign In", "/login"], ["Register", "/register"], ["Forgot Password", "/forgot-password"]].map(([l, r]) => (
                <button key={l} onClick={() => navigate(r)} className="lp-footer__link">{l}</button>
              ))}
            </div>
            <div className="lp-footer__col">
              <h4>Legal</h4>
              {["Privacy Policy", "Terms & Conditions", "Disclaimer", "Support"].map((l) => (
                <span key={l} className="lp-footer__link lp-footer__link--plain">{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="lp-footer__bottom">
          <span>© 2026 TradeXpert. All rights reserved. Virtual trading — for educational purposes only.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;