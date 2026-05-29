import PortfolioAnalytics from "../../components/portfolio/PortfolioAnalytics";

const formatINR = (value) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  }
};

const HoldingsTable = () => {
  // Placeholder rows (wire to API later)
  const rows = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      qty: 12,
      avgPrice: 2480,
      ltp: 2795,
      value: 33540,
      dayPnL: 1240,
      dayPnLPct: 0.037,
      totalPnL: 2920,
      totalPnLPct: 0.087,
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      qty: 5,
      avgPrice: 3450,
      ltp: 3745,
      value: 18725,
      dayPnL: -210,
      dayPnLPct: -0.011,
      totalPnL: 1475,
      totalPnLPct: 0.087,
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      qty: 20,
      avgPrice: 1540,
      ltp: 1622,
      value: 32440,
      dayPnL: 95,
      dayPnLPct: 0.006,
      totalPnL: 1640,
      totalPnLPct: 0.053,
    },
    {
      symbol: "INFY",
      name: "Infosys",
      qty: 9,
      avgPrice: 1420,
      ltp: 1365,
      value: 12285,
      dayPnL: -160,
      dayPnLPct: -0.012,
      totalPnL: -495,
      totalPnLPct: -0.032,
    },
  ];

  return (
    <section className="portfolio-holdings-card">
      <div className="portfolio-section-header">
        <h2>Holdings</h2>
        <p>Latest positions with performance (placeholder)</p>
      </div>

      <div className="portfolio-holdings-table-wrap">
        <table className="portfolio-holdings-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th className="num">Qty</th>
              <th className="num">Avg</th>
              <th className="num">LTP</th>
              <th className="num">Value</th>
              <th className="num">Day P/L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isPos = r.dayPnL >= 0;
              return (
                <tr key={r.symbol}>
                  <td>
                    <div className="holdings-stock">
                      <span className="holdings-symbol">{r.symbol}</span>
                      <span className="holdings-name">{r.name}</span>
                    </div>
                  </td>
                  <td className="num">{r.qty}</td>
                  <td className="num">{formatINR(r.avgPrice)}</td>
                  <td className="num">{formatINR(r.ltp)}</td>
                  <td className="num">{formatINR(r.value)}</td>
                  <td className={`num ${isPos ? "positive" : "negative"}`}>
                    {formatINR(r.dayPnL)} ({(r.dayPnLPct * 100).toFixed(2)}%)
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const Portfolio = () => {
  // Placeholder summary (wire to API later)
  const summary = {
    totalValue: 154_950,
    totalPnL: 8_430,
    totalPnLPct: 0.055,
    cash: 12_500,
    holdingsCount: 4,
  };

  const isPos = summary.totalPnL >= 0;

  return (
    <div className="portfolio-page">
      <div className="portfolio-hero">
        <div>
          <h1>Your Portfolio</h1>
          <p>Track holdings, allocation and performance.</p>
        </div>
        <div className="portfolio-badge-row">
          <div className="portfolio-badge">
            <span className="badge-label">Holdings</span>
            <span className="badge-value">{summary.holdingsCount}</span>
          </div>
          <div className="portfolio-badge">
            <span className="badge-label">Cash</span>
            <span className="badge-value">{formatINR(summary.cash)}</span>
          </div>
        </div>
      </div>

      <section className="portfolio-summary-grid">
        <div className="portfolio-summary-card">
          <div className="summary-card-label">Total Value</div>
          <div className="summary-card-value">{formatINR(summary.totalValue)}</div>
          <div className="summary-card-sub">Holdings + cash</div>
        </div>

        <div className="portfolio-summary-card">
          <div className="summary-card-label">Total Profit/Loss</div>
          <div className={`summary-card-value ${isPos ? "positive" : "negative"}`}>
            {formatINR(summary.totalPnL)} ({(summary.totalPnLPct * 100).toFixed(2)}%)
          </div>
          <div className="summary-card-sub">Since purchase</div>
        </div>

        <div className="portfolio-summary-card">
          <div className="summary-card-label">Invested Amount</div>
          <div className="summary-card-value">
            {formatINR(summary.totalValue - summary.cash)}
          </div>
          <div className="summary-card-sub">Portfolio capital</div>
        </div>

        <div className="portfolio-summary-card">
          <div className="summary-card-label">Allocation</div>
          <div className="summary-card-value">Stocks</div>
          <div className="summary-card-sub">See allocation chart</div>
        </div>
      </section>

      <section className="portfolio-main-grid">
        <div className="portfolio-analytics-col">
          <PortfolioAnalytics />
        </div>

        <div className="portfolio-table-col">
          <HoldingsTable />
        </div>
      </section>
    </div>
  );
};

export default Portfolio;

