import { Link } from "react-router-dom";
import { ArrowLeft, Lock, EyeOff, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="resources-container">
      <div className="resources-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us. Learn about our simulated data handling policies.</p>
      </div>

      <div className="resources-content">
        <section className="resources-section">
          <h2>
            <Lock size={20} className="section-title-icon" /> 1. Information We Collect
          </h2>
          <p>
            TradeXpert is a simulated paper trading platform. We only collect basic registration details:
          </p>
          <ul>
            <li><strong>Account Profile:</strong> Name, Email address, and an encrypted password.</li>
            <li><strong>Simulator Records:</strong> Your watchlists, simulated transactions, order history, and virtual cash balances.</li>
          </ul>
        </section>

        <section className="resources-section">
          <h2>
            <EyeOff size={20} className="section-title-icon" /> 2. Zero Financial Data Collection
          </h2>
          <p>
            Because TradeXpert is 100% free and strictly simulated:
          </p>
          <ul>
            <li>We do NOT collect credit card, debit card, or banking details.</li>
            <li>We do NOT request PAN card numbers, Demat accounts, or real trading credentials.</li>
            <li>We do NOT integrate with real bank accounts or brokerage providers.</li>
          </ul>
        </section>

        <section className="resources-section">
          <h2>
            <FileText size={20} className="section-title-icon" /> 3. Data Usage & Security
          </h2>
          <p>
            Your login details are stored securely using industry-standard hashing algorithms (bcrypt). 
            We do not share, sell, or rent your email address or trading logs to third-party advertisers. All simulated logs are kept strictly to provide dashboard functionality.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
