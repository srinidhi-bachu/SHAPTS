import React from "react";
import "./TopNav.css";

export default function TopNav({ onToggleSidebar }) {
  const name = localStorage.getItem("userName") || "Patient";
  const role = (localStorage.getItem("role") || "patient").toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  return (
    <header className="pt-topnav">
      <button className="pt-burger" onClick={onToggleSidebar} aria-label="Toggle Menu">
        <span />
        <span />
        <span />
      </button>

      <div className="pt-brand">
        <div className="pt-logo">SH</div>
        <div className="pt-brand-text">
          <h1>SHAPTS</h1>
          <small>Smart Health</small>
        </div>
      </div>

      <div className="pt-spacer" />

      <div className="pt-user">
        <div className="pt-role">{role}</div>
        <div className="pt-name">{name}</div>
        <button className="pt-logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
