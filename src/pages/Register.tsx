import "./Register.css";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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
    // Proceed with signup logic here
    console.log("Form submitted!");
  };

  return (
    <div className="register-page">
      {/* Side background image */}
      <img src="/Image2.png" className="side-image" alt="background" />

      {/* Register Card */}
      <div className="register-card">
        {/* Logo + Crowdlens centered at top */}
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

        {/* Google reCAPTCHA */}
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
          Already have an account? <span>Log In</span>
        </p>
      </div>
    </div>
  );
}