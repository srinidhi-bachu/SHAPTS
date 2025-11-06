    import React from "react";

    export default function AdminDashboard() {
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("role");

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>🏥 Admin Dashboard</h1>
        <h3>Welcome, {name}</h3>
        <p>Role: {role}</p>
        <p>Manage doctors, patients, schedules, and generate clinic analytics.</p>
        <button
            onClick={() => {
            localStorage.clear();
            window.location.href = "/";
            }}
        >
            Logout
        </button>
        </div>
    );
    }
