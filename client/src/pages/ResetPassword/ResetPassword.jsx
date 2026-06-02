import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Logo.png";
import { sendOtp, verifyOtp, resetForgottenPassword } from "../../services/authService";
import { useMarket } from "../../context/MarketContext";
import { 
  FaCheckCircle,
  FaRegCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { indices, connected } = useMarket();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState(1); // 1 = Request, 2 = Verify, 3 = Reset
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const otpInputsRef = useRef([]);

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

  // Auto focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && otpInputsRef.current[0]) {
      setTimeout(() => {
        otpInputsRef.current[0].focus();
      }, 100);
    }
  }, [step]);

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startResendTimer = () => {
    setTimer(60);
  };

  const handleOtpChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, ""); // allow only numbers
    const newOtpValues = [...otpValues];
    newOtpValues[index] = val;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (val !== "" && index < 5) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpValues[index] === "" && index > 0) {
        // Focus previous input on backspace if current is empty
        otpInputsRef.current[index - 1].focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtpValues(digits);
      // Focus the last input
      if (otpInputsRef.current[5]) {
        otpInputsRef.current[5].focus();
      }
    } else {
      toast.error("Please paste a valid 6-digit numeric OTP");
    }
  };

  const passwordRequirements = {
    length: passwords.newPassword.length >= 6,
    hasUppercase: /[A-Z]/.test(passwords.newPassword),
    hasNumber: /[0-9]/.test(passwords.newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPassword)
  };

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!emailOrPhone.trim()) {
      toast.error("Please enter your email or registered phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(emailOrPhone.trim());
      toast.success(res.message || "Verification code sent!", { icon: "🔑" });
      setStep(2);
      startResendTimer();
      setOtpValues(new Array(6).fill("")); // reset OTP inputs
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otpValues.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(emailOrPhone.trim(), fullOtp);
      toast.success("OTP Verified Successfully!", { icon: "✅" });
      setResetToken(res.resetToken);
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

    // Enforce strong password requirements
    if (
      !passwordRequirements.length ||
      !passwordRequirements.hasUppercase ||
      !passwordRequirements.hasNumber ||
      !passwordRequirements.hasSpecial
    ) {
      toast.error("Password does not meet all security requirements");
      return;
    }

    setLoading(true);
    try {
      await resetForgottenPassword({
        resetToken,
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
          {/* STEPPER PROGRESS */}
          <div className="auth-stepper">
            <div className="auth-stepper-progress" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            <div className={`auth-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
              {step > 1 ? "✓" : "1"}
            </div>
            <div className={`auth-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
              {step > 2 ? "✓" : "2"}
            </div>
            <div className={`auth-step ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`}>
              3
            </div>
          </div>

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
                <label className="auth-input-label" style={{ textAlign: "center", width: "100%" }}>
                  6-Digit Verification Code (OTP)
                </label>
                
                {/* 6 SPLIT INPUTS */}
                <div className="otp-input-container">
                  {otpValues.map((value, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      ref={el => otpInputsRef.current[idx] = el}
                      value={value}
                      onChange={e => handleOtpChange(e.target, idx)}
                      onKeyDown={e => handleOtpKeyDown(e, idx)}
                      onPaste={handleOtpPaste}
                      className="otp-digit-input"
                      required
                      disabled={loading}
                      placeholder="•"
                    />
                  ))}
                </div>
                
                <p className="auth-input-hint" style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
                  Check your server console/terminal logs to find the verification code.
                </p>
              </div>

              <div className="auth-action-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                <span onClick={() => setStep(1)} className="auth-action-link" style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--brand-accent)' }}>
                  Back to Step 1
                </span>
                {timer > 0 ? (
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Resend in {timer}s
                  </span>
                ) : (
                  <span onClick={() => handleRequestOtp()} className="auth-action-link" style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--brand-primary)', fontWeight: 'bold' }}>
                    Resend OTP
                  </span>
                )}
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
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="auth-input-field"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="password-toggle-btn"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password strength checklist */}
                <ul className="password-requirements-checklist">
                  <li className={`requirement-item ${passwordRequirements.length ? "met" : ""}`}>
                    <span className="requirement-icon">
                      {passwordRequirements.length ? <FaCheckCircle /> : <FaRegCircle />}
                    </span>
                    At least 6 characters
                  </li>
                  <li className={`requirement-item ${passwordRequirements.hasUppercase ? "met" : ""}`}>
                    <span className="requirement-icon">
                      {passwordRequirements.hasUppercase ? <FaCheckCircle /> : <FaRegCircle />}
                    </span>
                    At least 1 uppercase letter (A-Z)
                  </li>
                  <li className={`requirement-item ${passwordRequirements.hasNumber ? "met" : ""}`}>
                    <span className="requirement-icon">
                      {passwordRequirements.hasNumber ? <FaCheckCircle /> : <FaRegCircle />}
                    </span>
                    At least 1 number (0-9)
                  </li>
                  <li className={`requirement-item ${passwordRequirements.hasSpecial ? "met" : ""}`}>
                    <span className="requirement-icon">
                      {passwordRequirements.hasSpecial ? <FaCheckCircle /> : <FaRegCircle />}
                    </span>
                    At least 1 special character (!@#$%)
                  </li>
                </ul>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="auth-input-field"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle-btn"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
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
