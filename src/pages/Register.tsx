// src/pages/Register.tsx
import "./Register.css";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";

export default function Register() {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleCaptchaChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };

  const handleSignUp = () => {
    if (!captchaValue) {
      alert("Please verify that you are not a robot!");
      return;
    }
    // TODO: Proceed with signup logic (call backend)
    console.log("Form submitted!");
  };

  return (
    <div className="register-page">
      <img src="/Image2.png" className="side-image" alt="background" />

      <div className="register-card">
        <div className="logo-area">
          <img src="/Logo.png" alt="logo" className="logo" />
          <img src="/Crowdlens.png" alt="crowdlens" className="logo-text" />
        </div>

        <h1 className="title">Create Account</h1>

        <label>Email</label>
        <input type="email" placeholder="hello@crowdlens.com" />

        <label>Password</label>
        <input type="password" placeholder="••••••••" />

        <label>Confirm Password</label>
        <input type="password" placeholder="••••••••" />

        <div className="captcha-wrapper">
          <ReCAPTCHA
            sitekey="6Ld-eIYsAAAAAHv0Hx7lnj5-sb54WO7qKYzcCR_S"
            onChange={handleCaptchaChange}
          />
        </div>

        <button className="signup-btn" onClick={handleSignUp}>
          Sign Up
        </button>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/" className="login-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}