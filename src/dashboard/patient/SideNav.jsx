import React from "react";
import { FaCalendarAlt, FaUserMd, FaFileMedical, FaStar, FaHome, FaSignOutAlt } from "react-icons/fa";
import "./SideNav.css";

const items = [
  { key: "home", label: "Home", icon: <FaHome /> },
  { key: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
  { key: "doctors", label: "Doctors", icon: <FaUserMd /> },
  { key: "reports", label: "Reports", icon: <FaFileMedical /> },
  { key: "feedback", label: "Feedback", icon: <FaStar /> },
];

export default function SideNav({ isOpen, activeTab, onChange }) {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };
  return (
    <aside className={`pt-sidenav ${isOpen ? "open" : ""}`}>
      {items.map((it) => (
        <button
          key={it.key}
          className={`pt-sidenav-item ${activeTab === it.key ? "active" : ""}`}
          onClick={() => onChange(it.key)}
          aria-label={it.label}
        >
          <span className="icon">{it.icon}</span>
          <span className="label">{it.label}</span>
        </button>
      ))}
      <button className="pt-sidenav-item" onClick={logout} aria-label="Logout">
        <span className="icon"><FaSignOutAlt /></span>
        <span className="label">Logout</span>
      </button>
    </aside>
  );
}
