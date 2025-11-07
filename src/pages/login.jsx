import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./login.css";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
        role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userName", res.data.name);

      alert(`Login successful as ${res.data.role}`);

      if (res.data.role === "doctor") {
        window.location.href = "/doctor-dashboard";
      } else if (res.data.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/patient-dashboard";
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="illustration">
          <DotLottieReact
            src="/Doctor.lottie"
            loop
            autoplay
            style={{ width: "90%", height: "90%" }}
          />
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>SHAPTS Login</h2>
          <p className="subtitle">Smart Health Appointment Tracker</p>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}

          <p>
            New user? <a href="/register">Register here</a>
          </p>
          <p className="footer">© 2025 SHAPTS Healthcare</p>
        </form>
      </div>
    </div>
  );
}
