import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1 = Request Email, 2 = Set New Password
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const handleRequestReset = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success(`Virtual password reset link sent to: ${email}`, { icon: "📧" });
    setStep(2); // Progress to mock entering new password
  };

  const handleSavePassword = (e) => {
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

    toast.success("Virtual password reset successful!", { icon: "🔒" });
    navigate("/login");
  };

  return (
    <div className="auth-page-container">
      {/* BACKGROUND GLOWS */}
      <div className="auth-glow-ball top-left"></div>
      <div className="auth-glow-ball bottom-right"></div>
      <div className="auth-glow-ball center-bg"></div>

      {/* GRID OVERLAY EFFECT */}
      <div className="auth-grid-overlay"></div>

      <div className="auth-card">
        {/* LOGO */}
        <div className="auth-logo-box">
          <img src={logo} alt="TradeXpert" className="auth-logo-image" />
        </div>

        {step === 1 ? (
          /* STEP 1: REQUEST PASSWORD LINK */
          <form onSubmit={handleRequestReset}>
            <h1>Reset Password</h1>
            <p className="auth-subtitle">
              Enter your email address to trigger a simulated password recovery flow
            </p>

            <div className="auth-input-group">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input-field"
                required
              />

              <button type="submit" className="auth-submit-btn">
                Send Reset Link
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: SET MOCK NEW PASSWORD */
          <form onSubmit={handleSavePassword}>
            <h1>Set New Password</h1>
            <p className="auth-subtitle">
              Configure your new virtual account password below
            </p>

            <div className="auth-input-group">
              <input
                type="password"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="auth-input-field"
                required
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="auth-input-field"
                required
              />

              <button type="submit" className="auth-submit-btn">
                Save New Password
              </button>
            </div>
          </form>
        )}

        {/* REDIRECT ROW */}
        <div className="auth-redirect-row">
          <p>
            Remembered your credentials?{" "}
            <span
              onClick={() => navigate("/login")}
              className="auth-redirect-link"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
