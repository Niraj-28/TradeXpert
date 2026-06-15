import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import TransparentLogo from "../../components/ui/TransparentLogo";
import { loginUser, registerUser } from "../../services/authService";
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
  const niftyChange = niftyData ? parseFloat(niftyData.change) : 1.24;

  const sensexData = indices.find((ind) => ind.name === "SENSEX");
  const sensexChange = sensexData ? parseFloat(sensexData.change) : 1.08;

  const bankNiftyData = indices.find((ind) => ind.name === "BANK NIFTY");
  const bankNiftyChange = bankNiftyData ? parseFloat(bankNiftyData.change) : -0.15;

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

  const googleClientRef = useRef(null);

  const handleGoogleTokenResponse = async (accessToken) => {
    const toastId = toast.loading("Connecting with Google...");
    try {
      const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const payload = userInfoResponse.data;
      if (!payload || !payload.email) {
        throw new Error("Invalid Google account payload");
      }

      const googleUserData = {
        name: payload.name || "Google User",
        email: payload.email,
        password: "GooglePasswordSimulated123!" + payload.sub,
        phone: "0000000000",
      };

      let data;
      try {
        data = await registerUser(googleUserData);
      } catch (error) {
        data = await loginUser({
          email: googleUserData.email,
          password: googleUserData.password,
        });
      }

      login(data);
      toast.success(`Signed in as ${payload.name}`, { id: toastId });
      navigate("/markets");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Google Authentication Failed",
        { id: toastId }
      );
    }
  };

  const handleGoogleClick = () => {
    if (googleClientRef.current) {
      googleClientRef.current.requestAccessToken();
    } else {
      toast.error("Google login is not loaded yet. Please try again.");
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        googleClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "1063625752945-8f645853v47k1r827o4oic9qcfuom4cl.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              await handleGoogleTokenResponse(tokenResponse.access_token);
            }
          },
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

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

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleClick}
            className="auth-google-btn"
            style={{ marginTop: "12px" }}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="google-icon"
              style={{ width: "18px", height: "18px", display: "block" }}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v8.89h12.62c-.54 2.89-2.18 5.33-4.63 6.98l7.2 5.57C43.4 36.1 46.5 30.67 46.5 24z"
              />
              <path
                fill="#FBBC05"
                d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.2-5.57c-2 1.34-4.55 2.13-8.69 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continue with Google
          </button>

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