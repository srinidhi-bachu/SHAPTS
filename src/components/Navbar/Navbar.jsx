    import React from "react";
    import "./Navbar.css";
    import { FaBars } from "react-icons/fa";

    export default function Navbar({ toggleSidebar }) {
    const userName = localStorage.getItem("userName") || "Patient";

    return (
        <nav className="navbar">
        <div className="nav-left">
            <FaBars className="menu-icon" onClick={toggleSidebar} />
            <h2>SHAPTS Health Portal</h2>
        </div>
        <div className="nav-right">
            <span>👋 Hi, {userName}</span>
            <button
            className="logout-btn"
            onClick={() => {
                localStorage.clear();
                window.location.href = "/";
            }}
            >
            Logout
            </button>
        </div>
        </nav>
    );
    }
