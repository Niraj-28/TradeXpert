import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Logo.png";
import { sendOtp, verifyOtp, resetForgottenPassword } from "../../services/authService";
import { FaChartLine, FaShieldAlt, FaBriefcase, FaArrowUp } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Request, 2 = Verify, 3 = Reset
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!emailOrPhone.trim()) {
      toast.error("Please enter your email or registered phone number");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(emailOrPhone.trim());
      toast.success("Verification code sent! Check server console / logs.", { icon: "🔑" });
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(emailOrPhone.trim(), otp.trim());
      toast.success("OTP Verified Successfully!", { icon: "✅" });
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await resetForgottenPassword({
        emailOrPhone: emailOrPhone.trim(),
        otp: otp.trim(),
        newPassword: passwords.newPassword
      });
      toast.success("Password reset successful! Please login with your new password.", { icon: "🔒" });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
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
            <h2>Reset Password</h2>
            <p>Recover access to your virtual TradeXpert simulation account</p>
          </div>

          {step === 1 && (
            /* STEP 1: REQUEST OTP */
            <form onSubmit={handleRequestOtp} className="auth-actual-form">
              <div className="auth-input-group">
                <label className="auth-input-label">Email or Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter email or registered mobile number"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="auth-input-field"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            /* STEP 2: VERIFY OTP */
            <form onSubmit={handleVerifyOtp} className="auth-actual-form">
              <div className="auth-input-group">
                <label className="auth-input-label">6-Digit Verification Code (OTP)</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="auth-input-field"
                  maxLength={6}
                  required
                  disabled={loading}
                />
                <p className="auth-input-hint" style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Check your server console/terminal logs to find the verification code.
                </p>
              </div>

              <div className="auth-action-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span onClick={() => setStep(1)} className="auth-action-link" style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--brand-accent)' }}>
                  Back to Step 1
                </span>
                <span onClick={() => handleRequestOtp()} className="auth-action-link" style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--brand-primary)', fontWeight: 'bold' }}>
                  Resend OTP
                </span>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {step === 3 && (
            /* STEP 3: RESET PASSWORD */
            <form onSubmit={handleSavePassword} className="auth-actual-form">
              <div className="auth-input-group">
                <label className="auth-input-label">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password (min 6 chars)"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="auth-input-field"
                  required
                  disabled={loading}
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="auth-input-field"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Saving..." : "Save New Password"}
              </button>
            </form>
          )}

          <div className="auth-form-footer">
            <p>
              Remembered your credentials?{" "}
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

export default ResetPassword;
