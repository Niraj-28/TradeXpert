import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Logo.png";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useMarket } from "../../context/MarketContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { indices, connected } = useMarket();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const formatValue = (val) => {
    if (!val) return "—";
    let numStr = String(val).replace(/[₹,]/g, "");
    const num = parseFloat(numStr);
    if (isNaN(num)) return val;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  const niftyData = indices.find((ind) => ind.name === "NIFTY 50");
  const niftyValue = niftyData ? niftyData.value : 22450.00;
  const niftyChange = niftyData ? niftyData.change : 0.45;
  const isPositive = niftyChange >= 0;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      login(data);
      toast.success("Login Successful");
      navigate("/markets");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="auth-split-container">
      {/* LEFT COLUMN: HERO PANEL */}
      <div className="auth-hero-panel">
        <div className="auth-hero-glow"></div>
        <div className="auth-hero-grid-overlay"></div>
        
        <div className="auth-hero-content-wrap">
          <div className="auth-hero-logo" onClick={() => navigate("/")}>
            <img src={logo} alt="TradeXpert" />
          </div>

          <div className="auth-hero-main">
            <h1 className="auth-hero-tagline">
              Trade Smart.<br />
              <span>Master the Market.</span>
            </h1>
            <p className="auth-hero-desc">
              Practice stock trading using our high-performance virtual simulator powered by real-time Indian market feeds.
            </p>
          </div>

          {/* MINIMAL LIVE ACCENT CARD */}
          <div className="auth-hero-widget">
            <div className="widget-header">
              <span className="widget-title">Market Index Live Feed</span>
              <span className={`widget-status-dot ${connected ? "connected" : "simulated"}`}></span>
            </div>
            <div className="widget-body">
              <div className="widget-metric">
                <span className="metric-label">NIFTY 50</span>
                <div className="metric-row">
                  <span className="metric-value">{formatValue(niftyValue)}</span>
                  <span className={`metric-change ${isPositive ? "positive" : "negative"}`}>
                    {isPositive ? "▲" : "▼"} {Math.abs(niftyChange).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            <span>© 2026 TradeXpert. Practise virtual stock trading with zero financial risk.</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: FORM PANEL */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Welcome Back</h2>
            <p>Log in to access your virtual trading simulator portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-actual-form">
            <div className="auth-input-group">
              <label className="auth-input-label">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="auth-input-field"
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input-field"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="auth-forgot-link-row">
              <span 
                onClick={() => navigate("/reset-password")} 
                className="auth-forgot-link"
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In
            </button>
          </form>

          <div className="auth-form-footer">
            <p>
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} className="auth-redirect-link">
                Create Account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;