// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate(); 

  return (
    <div className="login-page">
      <img src="/Image2.png" alt="background" className="side-image" />

      <div className="login-card">
        {/* Logo area like register */}
        <div className="logo-area">
          <img src="/Logo.png" alt="Logo" className="logo" />
          <img src="/Crowdlens.png" alt="Crowdlens" className="logo-text" />
        </div>

        <h1 className="title">Welcome Back! 👋</h1>
        <p className="subtitle">Log in to your account</p>

        <label>Email</label>
        <input type="email" placeholder="hello@crowdlens.com" />

        <label>Password</label>
        <input type="password" placeholder="••••••••" />

        <button
              className="login-btn"
              onClick={() => navigate("/home")} 
                > Log In </button>
                
        <p className="forgot-password">Forgot password?</p>

        <p className="signup-text">
          Don’t have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#30924C" }}
            onClick={() => navigate("/register")} 
          >
            Sign Up
          </span>
        </p>

        <div className="social-login">
          <img src="/Image8.png" alt="Google" />
          <img src="/Image9.png" alt="Facebook" />
          <img src="/Image10.png" alt="Apple" />
        </div>
      </div>
    </div>
  );
}