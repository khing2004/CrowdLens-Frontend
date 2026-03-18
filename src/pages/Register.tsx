// src/pages/Register.tsx
import "./Register.css";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";
import "./Register.css";

export default function Register() {

  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    birthDate: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    if (!captchaValue){
      alert("Please verify that you are not a robot.");
      return;
    }
    // to validate
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!captchaValue) {
      alert("Please verify that you are not a robot!");
      return;
    }

    try {
      await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        birthDate: formData.birthDate
      });
      alert("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err: any){
      console.error(err);
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  // what are the different useStates? I noticed useState could go <> or () or [], what gives?
  const handleCaptchaChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };  


  return (
    <div className="register-page">
      <img src="/Image2.png" className="side-image" alt="background" />

      <div className="register-card" style={{ top: "100px", width: "350px" }}>
        <div className="logo-area">
          <img src="/Logo.png" alt="logo" className="logo" />
          <img src="/Crowdlens.png" alt="crowdlens" className="logo-text" />
        </div>

        <h1 className="title">Create Account</h1>

        <label>Full Name</label>
        <input name="fullName" type="text" placeholder="Ex. Wince Dela Cruz" onChange={handleChange} />

        <label>Email</label>
        <input name="email" type="email" placeholder="hello@crowdlens.com" onChange={handleChange} />

        <label>Address</label>
        <input name="address" type="text" placeholder="Davao City" onChange={handleChange} />

        <label>Birth Date</label>
        <input name="birthDate" type="date" onChange={handleChange} />

        <label>Password</label>
        <input name="password" type="password" placeholder="••••••••" onChange={handleChange} />

        <label>Confirm Password</label>
        <input name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} />

        <div className="captcha-wrapper">
          <ReCAPTCHA
            sitekey="6Ld-eIYsAAAAAHv0Hx7lnj5-sb54WO7qKYzcCR_S"
            onChange={(val) => setCaptchaValue(val)}
          />
        </div>

        <button className="signup-btn" onClick={handleSignUp}>
          Sign Up
        </button>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">Log In</Link>
        </p>
      </div>
    </div>
  );
}