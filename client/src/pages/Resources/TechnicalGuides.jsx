import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Activity, BarChart2 } from "lucide-react";

const TechnicalGuides = () => {
  return (
    <div className="resources-container">
      <div className="resources-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1>Technical Guides & Platform Mechanics</h1>
        <p>Learn how the live sockets, portfolio tracking, and analytics engine works behind the scenes.</p>
      </div>

      <div className="resources-content">
        <section className="resources-section">
          <h2>
            <Cpu size={20} className="section-title-icon" /> 1. Real-time WebSocket Synchronization
          </h2>
          <p>
            TradeXpert utilizes WebSockets (`socket.io`) to stream market feeds directly from the server. 
            When market updates are emitted, the client updates the state for indices, stock prices, and top gainers/losers in real-time.
          </p>
          <ul>
            <li><strong>Tick Rate:</strong> Feeds tick every 3 seconds to match live trade updates.</li>
            <li><strong>Intraday History:</strong> The client stores up to 15 ticks of history locally to plot immediate sparkline trends.</li>
          </ul>
        </section>

        <section className="resources-section">
          <h2>
            <Activity size={20} className="section-title-icon" /> 2. Portfolio Calculations
          </h2>
          <p>
            Your portfolio analytics dashboard tracks holdings and metrics using the following logic:
          </p>
          <ul>
            <li>
              <strong>Average Buy Price:</strong> Calculated as a weighted average: `(Total Cost of Buys - Total Cost of Sells) / Net Quantity`.
            </li>
            <li>
              <strong>Current Value:</strong> Evaluated dynamically as `Current Price * Total Shares Held`.
            </li>
            <li>
              <strong>Total Profit & Loss (P&L):</strong> Calculated in real-time: `(Current Value - Invested Capital)`.
            </li>
          </ul>
        </section>

        <section className="resources-section">
          <h2>
            <BarChart2 size={20} className="section-title-icon" /> 3. Technical Charts & Sparklines
          </h2>
          <p>
            We use Recharts library for rendering responsive technical indicators:
          </p>
          <ul>
            <li>
              <strong>Candlestick Charts:</strong> Represents Open, High, Low, and Close (OHLC) values for stocks.
            </li>
            <li>
              <strong>Area Sparklines:</strong> Renders visual cues on stock cards. If positive returns are recorded, the chart area fills with a mint-green gradient; if negative, a soft red gradient is applied.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TechnicalGuides;
