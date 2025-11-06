    import React from "react";
    import { FaUserMd, FaCalendarCheck, FaChartPie, FaSignOutAlt } from "react-icons/fa";

    export default function DashboardLayout({ title, children }) {
    const userName = localStorage.getItem("userName");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
            <h2>SHAPTS</h2>
            <ul>
            <li><FaChartPie /> Overview</li>
            <li><FaUserMd /> Profile</li>
            <li><FaCalendarCheck /> Appointments</li>
            <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
            </ul>
        </aside>

        {/* Main Dashboard Area */}
        <main className="main-content">
            <header className="topbar">
            <h1>{title}</h1>
            <p>
                Welcome, <b>{userName}</b> ({role})
            </p>
            </header>

            <section className="content">{children}</section>
        </main>
        </div>
    );
    }
