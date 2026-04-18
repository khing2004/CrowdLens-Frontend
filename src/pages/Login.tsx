// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try{
      await authService.login(email, password);

      //redicter to home page after log in
      navigate("/home");
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src="/Image2.png" alt="background" className="side-image" />

      <div className="login-card">
        <div className="logo-area">
          <img src="/Logo.png" alt="Logo" className="logo" />
          <img src="/Crowdlens.png" alt="Crowdlens" className="logo-text" />
        </div>

        <h1 className="title">Welcome Back! 👋</h1>
        <p className="subtitle">Log in to your account</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Email</label>
          <input 
            type="email" 
            placeholder="hello@crowdlens.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="forgot-password">Forgot password?</p>

        <p className="signup-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}