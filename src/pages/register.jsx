import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./register.css";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("Please fill all fields");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, form);
      setSuccess("Registered successfully! Redirecting to login...");
      setError("");
      setTimeout(() => (window.location.href = "/"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="illustration">
          <DotLottieReact
            src="/register.lottie"
            loop
            autoplay
            style={{ width: "90%", height: "90%" }}
          />
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p className="subtitle">Join SHAPTS Healthcare System</p>

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">Register</button>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <p>
            Already have an account? <a href="/">Login here</a>
          </p>
          <p className="footer">© 2025 SHAPTS Healthcare</p>
        </form>
      </div>
    </div>
  );
}
