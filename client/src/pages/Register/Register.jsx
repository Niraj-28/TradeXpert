import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Logo.png";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { FaChartLine, FaShieldAlt, FaBriefcase, FaArrowUp } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      login(data);
      toast.success("Account Created Successfully");
      navigate("/markets");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
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
              Invest Better.<br />
              <span>Master The Market.</span>
            </h1>
            <p className="auth-hero-desc">
              Practise virtual stock trading using live Indian indices, interactive chart technicals, watchlists, and comprehensive portfolio tracking.
            </p>
          </div>

          {/* SIMULATED ACCENT CARD FOR GRAPHICS */}
          <div className="auth-hero-widget">
            <div className="widget-header">
              <span className="widget-title">Indices Highlight</span>
              <span className="widget-badge">Live Feed</span>
            </div>
            <div className="widget-body">
              <div className="widget-metric">
                <span className="metric-label">NIFTY 50</span>
                <div className="metric-row">
                  <span className="metric-value">₹24,850.00</span>
                  <span className="metric-change positive">
                    <FaArrowUp size={8} /> +1.25%
                  </span>
                </div>
              </div>
              <div className="widget-mini-chart">
                <div className="chart-bar" style={{ height: "40%" }}></div>
                <div className="chart-bar" style={{ height: "55%" }}></div>
                <div className="chart-bar" style={{ height: "70%" }}></div>
                <div className="chart-bar" style={{ height: "50%" }}></div>
                <div className="chart-bar active" style={{ height: "85%" }}></div>
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            <div className="hero-bullet">
              <FaChartLine className="bullet-icon" />
              <span>Real-Time Quotes</span>
            </div>
            <div className="hero-bullet">
              <FaShieldAlt className="bullet-icon" />
              <span>Zero Risk Trading</span>
            </div>
            <div className="hero-bullet">
              <FaBriefcase className="bullet-icon" />
              <span>Full Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: FORM PANEL */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Create Account</h2>
            <p>Sign up to start your risk-free stock simulation journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-actual-form">
            <div className="auth-input-group">
              <label className="auth-input-label">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                className="auth-input-field"
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                onChange={handleChange}
                className="auth-input-field"
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Choose password (min 6 chars)"
                onChange={handleChange}
                className="auth-input-field"
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="10-digit mobile number"
                onChange={handleChange}
                className="auth-input-field"
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign Up
            </button>
          </form>

          <div className="auth-form-footer">
            <p>
              Already registered?{" "}
              <span onClick={() => navigate("/login")} className="auth-redirect-link">
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;