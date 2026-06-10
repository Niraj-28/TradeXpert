import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TransparentLogo from "../../components/ui/TransparentLogo";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useMarket } from "../../context/MarketContext";
import {
  FaCheckCircle,
  FaRegCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { indices, connected } = useMarket();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
  const niftyChange = niftyData ? parseFloat(niftyData.change) : 1.24;

  const sensexData = indices.find((ind) => ind.name === "SENSEX");
  const sensexChange = sensexData ? parseFloat(sensexData.change) : 1.08;

  const bankNiftyData = indices.find((ind) => ind.name === "BANK NIFTY");
  const bankNiftyChange = bankNiftyData ? parseFloat(bankNiftyData.change) : -0.15;

  const passwordRequirements = {
    length: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password strength
    if (
      !passwordRequirements.length ||
      !passwordRequirements.hasUppercase ||
      !passwordRequirements.hasNumber ||
      !passwordRequirements.hasSpecial
    ) {
      toast.error("Password does not meet all security requirements");
      return;
    }

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
          {/* Centered minimalist column */}
          <div className="auth-hero-center-block">
            <div className="auth-hero-logo-center" onClick={() => navigate("/")}>
              <TransparentLogo style={{ height: "72px", cursor: "pointer" }} />
            </div>

            <h1 className="auth-hero-headline">
              Practice trading.<br />
              <span>Master the market.</span>
            </h1>

            <p className="auth-hero-subtext">
              High-fidelity virtual trading simulator synced with real-time Indian stock market feeds. Master your investment strategies without risking capital.
            </p>

            <div className="auth-hero-indices-card">
              <div className="auth-hero-indices-row">
                <div className="index-item">
                  <span className="index-name">NIFTY 50</span>
                  <span className={`index-change ${niftyChange >= 0 ? "positive" : "negative"}`}>
                    {niftyChange >= 0 ? "+" : ""}{niftyChange.toFixed(2)}%
                  </span>
                </div>
                <div className="index-item">
                  <span className="index-name">SENSEX</span>
                  <span className={`index-change ${sensexChange >= 0 ? "positive" : "negative"}`}>
                    {sensexChange >= 0 ? "+" : ""}{sensexChange.toFixed(2)}%
                  </span>
                </div>
                <div className="index-item">
                  <span className="index-name">BANK NIFTY</span>
                  <span className={`index-change ${bankNiftyChange >= 0 ? "positive" : "negative"}`}>
                    {bankNiftyChange >= 0 ? "+" : ""}{bankNiftyChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: FORM PANEL */}
      <div className="auth-form-panel">
        <div className="auth-form-container compact-form">
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
                value={formData.name}
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
                  placeholder="Choose password"
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

              {/* Password strength checklist */}
              <ul className="password-requirements-checklist" style={{ marginTop: '4px' }}>
                <li className={`requirement-item ${passwordRequirements.length ? "met" : ""}`}>
                  <span className="requirement-icon">
                    {passwordRequirements.length ? <FaCheckCircle /> : <FaRegCircle />}
                  </span>
                  Min 6 characters
                </li>
                <li className={`requirement-item ${passwordRequirements.hasUppercase ? "met" : ""}`}>
                  <span className="requirement-icon">
                    {passwordRequirements.hasUppercase ? <FaCheckCircle /> : <FaRegCircle />}
                  </span>
                  1 uppercase letter (A-Z)
                </li>
                <li className={`requirement-item ${passwordRequirements.hasNumber ? "met" : ""}`}>
                  <span className="requirement-icon">
                    {passwordRequirements.hasNumber ? <FaCheckCircle /> : <FaRegCircle />}
                  </span>
                  1 number (0-9)
                </li>
                <li className={`requirement-item ${passwordRequirements.hasSpecial ? "met" : ""}`}>
                  <span className="requirement-icon">
                    {passwordRequirements.hasSpecial ? <FaCheckCircle /> : <FaRegCircle />}
                  </span>
                  1 special character (!@#$%)
                </li>
              </ul>
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="10-digit mobile number"
                value={formData.phone}
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