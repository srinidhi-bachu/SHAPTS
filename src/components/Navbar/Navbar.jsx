    import React from "react";
    import styles from "./Navbar.module.css";

    export default function Navbar({ toggleSidebar }) {
    const name = localStorage.getItem("userName") || "Patient";
    const role = (localStorage.getItem("role") || "patient").toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        window.location.href = "/";
    };

    return (
        <header className={styles.navbar}>
        <button className={styles.menu} onClick={toggleSidebar} aria-label="Toggle Menu">
            <span />
            <span />
            <span />
        </button>

        <div className={styles.brand}>
            <div className={styles.logo}>SH</div>
            <div className={styles.title}>
            <h2>SHAPTS</h2>
            <small>Smart Health</small>
            </div>
        </div>

        <div className={styles.spacer} />

        <div className={styles.right}>
            <div className={styles.role}>{role}</div>
            <div className={styles.name}>{name}</div>
            <button className={styles.logout} onClick={handleLogout}>Logout</button>
        </div>
        </header>
    );
    }
