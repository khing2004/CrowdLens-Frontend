import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import { toastError } from "../components/Toast";
import "./Login.css";

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="login-blob login-blob--tl" aria-hidden="true" />
      <div className="login-blob login-blob--br" aria-hidden="true" />

      <div className="login-card">
        <div className="logo-area">
          <img src="/Logo.png" alt="CrowdLens logo" className="logo" />
          <img src="/Crowdlens.png" alt="CrowdLens" className="logo-text" />
        </div>

        <h1 className="title">Welcome back</h1>
        <p className="subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleLogin} className="login-form" noValidate>
          <div className="field-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field-group">
            <div className="label-row">
              <label htmlFor="login-password">Password</label>
              <span className="forgot-password" role="button" tabIndex={0}>
                Forgot password?
              </span>
            </div>
            <div className="input-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="signup-text">
          Don&apos;t have an account?{" "}
          <span
            role="button"
            tabIndex={0}
            onClick={() => navigate("/register")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/register")}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
