import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Logo.png";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

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
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
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

      {/* REGISTER CARD */}
      <form onSubmit={handleSubmit} className="auth-card">
        {/* LOGO */}
        <div className="auth-logo-box">
          <img src={logo} alt="TradeXpert" className="auth-logo-image" />
        </div>

        {/* TITLE */}
        <h1>Create Account</h1>
        <p className="auth-subtitle">Sign up to access virtual trading simulations and track performance</p>

        {/* INPUTS */}
        <div className="auth-input-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="auth-input-field"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="auth-input-field"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Choose Password"
            onChange={handleChange}
            className="auth-input-field"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="auth-input-field"
            required
          />

          <button type="submit" className="auth-submit-btn">
            Register
          </button>
        </div>

        {/* LOGIN REDIRECT */}
        <div className="auth-redirect-row">
          <p>
            Already registered?{" "}
            <span
              onClick={() => navigate("/login")}
              className="auth-redirect-link"
            >
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;