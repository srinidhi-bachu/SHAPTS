    import React from "react";
    import { DotLottieReact } from "@lottiefiles/dotlottie-react";
    import "./heroBanner.css";

    export default function HeroBanner({ userName }) {
    return (
        <section className="hero-banner">
        <div className="hero-content">
            <h2>
            👋 Welcome, <span>{userName || "Patient"}</span>
            </h2>
            <p>Your health, our priority — book appointments with trusted doctors anytime.</p>

            <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/book-appointment")}>
                🩺 Book Appointment
</button>

            <button className="secondary-btn">📋 View Reports</button>
            </div>
        </div>

        {/* Right side illustration */}
        <div className="hero-illustration">
            <DotLottieReact
            src="/doctor.lottie"
            autoplay
            loop
            style={{ width: "280px", height: "280px" }}
            />
        </div>
        </section>
    );
    }
