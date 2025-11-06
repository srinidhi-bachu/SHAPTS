    import React, { useState } from "react";
    import Navbar from "../components/Navbar/Navbar";
    import Sidebar from "./sidenav/Sidebar";
    import "./dashboardLayout.css";

    export default function DashboardLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userName = localStorage.getItem("userName") || "Guest";
    const role = localStorage.getItem("role") || "Patient";

    return (
        <div className={`dashboard-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Top Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main content area */}
        <main className="dashboard-main">
            <header className="dashboard-header">
            <h2>{title}</h2>
            <p>Welcome back, <b>{userName}</b> 👋 ({role})</p>
            </header>
            <div className="dashboard-content">{children}</div>
        </main>
        </div>
    );
    }
