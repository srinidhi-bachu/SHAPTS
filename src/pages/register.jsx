    import React, { useState } from "react";
    import { DotLottieReact } from "@lottiefiles/dotlottie-react";
    import "./register.css";
    import axios from "axios";
    import { API_BASE_URL } from "../apiConfig";

    export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("patient");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendOTP = () => {
        if (!email) {
        setError("Please enter your email before sending OTP");
        return;
        }
        setError("");
        setOtpSent(true);
        setSuccess("OTP sent successfully to your email!");
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
        setError("Please fill all fields");
        return;
        }

        if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
        }

        if (!otp) {
        setError("Please enter the OTP sent to your email");
        return;
        }

        try {
        const response = await axios.post("http://localhost:5000/api/register", {
            name,
            email,
            password,
            role,
        });

        alert(response.data.message || `Registered successfully as ${role}`);
        setSuccess("Registered successfully! Redirecting to login...");
        setError("");
        window.location.href = "/";
        } catch (error) {
        console.error("Registration Error:", error);
        setError(
            error.response?.data?.message ||
            "Registration failed. Please try again."
        );
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

            <form className="register-form" onSubmit={handleRegister}>
            <h2>Create Account</h2>
            <p className="subtitle">Join the SHAPTS Healthcare System</p>

            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
            </select>

            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {!otpSent ? (
                <button type="button" onClick={handleSendOTP}>
                Send OTP
                </button>
            ) : (
                <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                />
            )}

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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