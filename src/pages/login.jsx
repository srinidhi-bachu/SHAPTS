import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./login.css";
import axios from "axios";

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
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        role,
      });

      // ✅ Store important info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userId", response.data._id || "");

      // ✅ Store Doctor ID (used in doctor dashboard)
      localStorage.setItem(
        "doctorId",
        response.data.user?._id || response.data._id || ""
      );

      alert(response.data.message || `Login successful as ${response.data.role}`);

      // ✅ Redirect based on role
      if (response.data.role === "doctor") {
        window.location.href = "/doctor-dashboard";
      } else if (response.data.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/patient-dashboard";
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(
        error.response?.data?.message || "Invalid credentials or server error"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side Animation */}
        <div className="illustration">
          <DotLottieReact
            src="/Doctor.lottie"
            loop
            autoplay
            style={{ width: "90%", height: "90%" }}
          />
        </div>

        {/* Right Side Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <h2>SHAPTS Login</h2>
          <p className="subtitle">
            Smart Health Appointment & Prescription Tracker
          </p>

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
