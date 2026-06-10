import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Clock, Shield } from "lucide-react";

const TradingRules = () => {
  return (
    <div className="resources-container">
      <div className="resources-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1>Platform Trading Rules</h1>
        <p>Learn the mechanics, limitations, and guidelines of virtual trading on TradeXpert.</p>
      </div>

      <div className="resources-content">
        <section className="resources-section">
          <h2>1. Virtual Currency Allocation</h2>
          <p>
            Upon registration, every TradeXpert account is automatically credited with a virtual paper cash balance of <strong>₹10,00,000 (Ten Lakhs Rupees)</strong>. 
            This balance is strictly virtual and is designed to allow you to practice trading risk-free.
          </p>
          <div className="info-box">
            <AlertCircle size={18} className="info-icon" />
            <span>You can reset your virtual portfolio balance at any time from your Profile settings.</span>
          </div>
        </section>

        <section className="resources-section">
          <h2>2. Order Execution Types</h2>
          <p>
            TradeXpert supports two primary order execution methods to mimic real stock exchanges:
          </p>
          <ul>
            <li>
              <strong>Market Orders:</strong> Executed immediately at the current last traded price (LTP) streamed via WebSockets.
            </li>
            <li>
              <strong>Limit Orders:</strong> Placed at a specific target price. These orders remain in a "Pending" state until the market price ticks at or matches your specified limit price, at which point they execute automatically in the background.
            </li>
          </ul>
        </section>

        <section className="resources-section">
          <h2>3. Trading Hours & Timeframes</h2>
          <p>
            Our simulation feed ticks during normal Indian stock market hours (Monday to Friday, 9:15 AM to 3:30 PM IST). 
            Any pending limit orders that are not filled by the close of market hours (3:30 PM) are automatically cancelled.
          </p>
          <div className="timeline-rules">
            <div className="time-rule">
              <Clock size={16} /> <span><strong>9:15 AM</strong> - Market Open & Live Feeds Active</span>
            </div>
            <div className="time-rule">
              <Clock size={16} /> <span><strong>3:30 PM</strong> - Market Close & Pending Order Cancellation</span>
            </div>
          </div>
        </section>

        <section className="resources-section">
          <h2>4. Transaction Charges & Levies</h2>
          <p>
            To provide a realistic trading experience, TradeXpert simulates standard brokerage fees and exchange transaction taxes:
          </p>
          <ul>
            <li><strong>Virtual Brokerage:</strong> Flat 0.05% of trade value or ₹20 per trade (whichever is lower).</li>
            <li><strong>Securities Transaction Tax (STT):</strong> 0.1% on delivery buy/sell transactions.</li>
          </ul>
        </section>

        <div className="disclaimer-banner">
          <Shield size={20} className="disclaimer-icon" />
          <div>
            <h3>Simulated Paper Trading Only</h3>
            <p>All trades, balances, holdings, and transactions on TradeXpert are strictly simulated. No real money or securities are processed or held.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingRules;
