import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Logo.png";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    <div className="auth-page-container">
      {/* BACKGROUND GLOWS */}
      <div className="auth-glow-ball top-left"></div>
      <div className="auth-glow-ball bottom-right"></div>
      <div className="auth-glow-ball center-bg"></div>

      {/* GRID OVERLAY EFFECT */}
      <div className="auth-grid-overlay"></div>

      {/* LOGIN CARD */}
      <form onSubmit={handleSubmit} className="auth-card">
        {/* LOGO */}
        <div className="auth-logo-box">
          <img src={logo} alt="TradeXpert" className="auth-logo-image" />
        </div>

        {/* TITLE */}
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to monitor watchlists, analyze technicals, and trade virtual assets</p>

        {/* INPUTS */}
        <div className="auth-input-group">
          <input
            type="email"
            name="email"
            placeholder="Enter registered email"
            onChange={handleChange}
            className="auth-input-field"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            className="auth-input-field"
            required
          />

          <div className="auth-forgot-link-row">
            <span 
              onClick={() => navigate("/reset-password")} 
              className="auth-forgot-link"
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        </div>

        {/* REGISTER REDIRECT */}
        <div className="auth-redirect-row">
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="auth-redirect-link"
            >
              Create Account
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;