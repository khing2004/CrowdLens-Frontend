// src/pages/Register.tsx
import "./Register.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";
import { toastError, toastSuccess } from "../components/Toast";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    birthDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      toastError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        birthDate: formData.birthDate,
      });
      toastSuccess("Registration successful! Redirecting to login…");
      setTimeout(() => navigate("/"), 1800);
    } catch (err: any) {
      toastError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <img src="/Image2.png" className="side-image" alt="" aria-hidden="true" />

      <div className="register-card">
        <div className="logo-area">
          <img src="/Logo.png" alt="CrowdLens logo" className="logo" />
          <img src="/Crowdlens.png" alt="CrowdLens" className="logo-text" />
        </div>

        <h1 className="title">Create Account</h1>

        <label htmlFor="reg-fullName">Full Name</label>
        <input id="reg-fullName" name="fullName" type="text" placeholder="Ex. Juan Dela Cruz" onChange={handleChange} required />

        <label htmlFor="reg-email">Email</label>
        <input id="reg-email" name="email" type="email" placeholder="hello@crowdlens.com" onChange={handleChange} required />

        <label htmlFor="reg-address">Address</label>
        <input id="reg-address" name="address" type="text" placeholder="Cebu City" onChange={handleChange} required />

        <label htmlFor="reg-birthDate">Birth Date</label>
        <input id="reg-birthDate" name="birthDate" type="date" onChange={handleChange} required />

        <label htmlFor="reg-password">Password</label>
        <input id="reg-password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />

        <label htmlFor="reg-confirmPassword">Confirm Password</label>
        <input id="reg-confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} required />

        <button className="signup-btn" onClick={handleSignUp} disabled={loading}>
          {loading ? "Creating account…" : "Sign Up"}
        </button>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/" className="login-link">Log In</Link>
        </p>
      </div>
    </div>
  );
}
