import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Award, FileSpreadsheet } from "lucide-react";

const TermsOfUse = () => {
  return (
    <div className="resources-container">
      <div className="resources-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1>Terms of Use</h1>
        <p>Understand the educational disclaimer, rules, and conditions for using TradeXpert.</p>
      </div>

      <div className="resources-content">
        <section className="resources-section">
          <h2>
            <ShieldAlert size={20} className="section-title-icon" /> 1. Simulation & Educational Disclaimer
          </h2>
          <p>
            TradeXpert is a paper trading platform designed for education, training, and strategic simulation. 
            All portfolios, virtual cash balances (₹10 Lakhs), trades, holdings, and P&L results are strictly virtual and fictitious.
          </p>
          <div className="warning-box">
            <strong>Warning:</strong> Never attempt to base real market investments on the specific simulation results or WebSocket ticks generated in this demo environment.
          </div>
        </section>

        <section className="resources-section">
          <h2>
            <Award size={20} className="section-title-icon" /> 2. No Financial Advice
          </h2>
          <p>
            The content, charts, technical indicators, and financial news items displayed on TradeXpert are for educational placements only. 
            We do not provide certified investment advice, buy/sell recommendations, or brokerage placements.
          </p>
        </section>

        <section className="resources-section">
          <h2>
            <FileSpreadsheet size={20} className="section-title-icon" /> 3. Limitation of Liability
          </h2>
          <p>
            TradeXpert is provided "as is" and "as available". We hold no liability for simulation downtime, socket disconnects, feed inaccuracies, or any decision made using simulated data.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUse;
