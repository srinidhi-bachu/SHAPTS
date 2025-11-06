import React from "react";
import { FaCalendarAlt, FaUserMd, FaFileMedical, FaStar, FaHome, FaSignOutAlt } from "react-icons/fa";
import styles from "./SideNav.module.css";

const items = [
  { key: "home", label: "Home", icon: <FaHome /> },
  { key: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
  { key: "doctors", label: "Search Doctor", icon: <FaUserMd /> },
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
    <aside className={`${styles.wrap} ${isOpen ? styles.open : ""}`}>
      {items.map((it) => (
        <button
          key={it.key}
          className={`${styles.item} ${activeTab === it.key ? styles.active : ""}`}
          onClick={() => onChange?.(it.key)}
          aria-label={it.label}
        >
          <span className={styles.icon}>{it.icon}</span>
          <span className={styles.label}>{it.label}</span>
        </button>
      ))}
      <button className={styles.item} onClick={logout} aria-label="Logout">
        <span className={styles.icon}><FaSignOutAlt /></span>
        <span className={styles.label}>Logout</span>
      </button>
    </aside>
  );
}
