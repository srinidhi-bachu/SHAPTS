    import React, { useState } from "react";
    import { DotLottieReact } from "@lottiefiles/dotlottie-react";
    import "./login.css";

    export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("patient");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
        setError("Please fill all fields");
        return;
        }

        // Dummy user profile based on role
        const nameGuess = email.split("@")[0].replace(/\W+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "User";

        localStorage.setItem("token", "dummy-token");
        localStorage.setItem("role", role);
        localStorage.setItem("userName", nameGuess);

        // Redirect based on role
        if (role === "doctor") {
        window.location.href = "/doctor-dashboard";
        } else if (role === "admin") {
        window.location.href = "/admin-dashboard";
        } else {
        window.location.href = "/patient-dashboard";
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