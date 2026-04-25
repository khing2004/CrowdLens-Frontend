// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import { toastError } from "../components/Toast";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login(email, password);
      refreshUser();
      navigate("/home");
    } catch (err: any) {
      toastError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src="/Image2.png" alt="" className="side-image" aria-hidden="true" />

      <div className="login-card">
        <div className="logo-area">
          <img src="/Logo.png" alt="CrowdLens logo" className="logo" />
          <img src="/Crowdlens.png" alt="CrowdLens" className="logo-text" />
        </div>

        <h1 className="title">Welcome Back! 👋</h1>
        <p className="subtitle">Log in to your account</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="hello@crowdlens.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="forgot-password">Forgot password?</p>

        <p className="signup-text">
          Don&apos;t have an account?{" "}
          <span role="button" tabIndex={0} onClick={() => navigate("/register")} onKeyDown={(e) => e.key === "Enter" && navigate("/register")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
