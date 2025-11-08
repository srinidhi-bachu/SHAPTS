import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="brand">SHAPTS</div>
          {/* Actions moved to hero */}
        </div>
      </nav>

      {/* Header Section (Minimal) */}
      <header className="hero minimal">
        <h1>
          Smart Health Appointment &<br />
          Prescription Tracker
        </h1>
        <p>
          Digitalizing healthcare journey from appointments to prescriptions,
          reports, and follow-ups
        </p>
        <div className="hero-cta">
          <Link className="btn primary btn-pill" to="/register">Get Started</Link>
          <Link className="btn secondary btn-pill" to="/login">Login</Link>
        </div>
      </header>

      {/* Features Section (Slim) */}
      <section className="features minimal">
        <h2>Built for modern healthcare</h2>
        <div className="feature-grid slim">
          <div className="feature-card">
            <div className="icon" aria-hidden>📅</div>
            <h3>Smart Appointments</h3>
            <p>Book, reschedule, or cancel with real-time updates.</p>
          </div>
          <div className="feature-card">
            <div className="icon" aria-hidden>💊</div>
            <h3>Digital Prescriptions</h3>
            <p>Access and verify prescriptions with QR.</p>
          </div>
          <div className="feature-card">
            <div className="icon" aria-hidden>🔒</div>
            <h3>Secure Records</h3>
            <p>Encrypted, HIPAA-compliant storage.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Transform Healthcare?</h2>
        <p>Join thousands of patients, doctors, and healthcare providers using SHAPTS</p>
        <Link className="cta-btn btn-pill" to="/register">Get Started Now</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div> {new Date().getFullYear()} SHAPTS. All rights reserved.</div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
