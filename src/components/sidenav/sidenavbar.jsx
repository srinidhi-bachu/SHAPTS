    import React from "react";
    import { FaChartPie, FaCalendarAlt, FaUserMd, FaComments, FaSignOutAlt } from "react-icons/fa";
    import "./sidenavbar.css";

    export default function Sidebar({ isOpen }) {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <aside className={`sidebar-modern ${isOpen ? "open" : ""}`}>
        <ul>
            <li><FaChartPie /> Dashboard</li>
            <li><FaCalendarAlt /> Appointments</li>
            <li><FaUserMd /> Doctors</li>
            <li><FaComments /> Feedback</li>
            <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
        </aside>
    );
    }
