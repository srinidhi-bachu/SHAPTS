    import React, { useState } from "react";
    import Navbar from "../../components/Navbar/Navbar";
    import Sidebar from "../../components/sidenav/sidenavbar";
    import "./patientDashboard.css";
    import HeroBanner from "./heroBanner";

    export default function PatientDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div className="patient-dashboard">
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <HeroBanner userName={localStorage.getItem("userName")} />


        <Sidebar
            isOpen={isSidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />

        <div className={`dashboard-content ${isSidebarOpen ? "shifted" : ""}`}>
            {activeTab === "home" && <h2>🏠 Welcome to SHAPTS Health Portal</h2>}
            {activeTab === "appointments" && <h2>📅 Manage Appointments</h2>}
            {activeTab === "doctors" && <h2>🩺 Find Doctors</h2>}
            {activeTab === "reports" && <h2>📑 View Reports</h2>}
            {activeTab === "feedback" && <h2>⭐ Give Feedback</h2>}
        </div>
        </div>
    );
    }
