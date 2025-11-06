    import React from "react";

    export default function DoctorDashboard() {
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("role");

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>👨‍⚕️ Doctor Dashboard</h1>
        <h3>Welcome, Dr. {name}</h3>
        <p>Role: {role}</p>
        <p>Here you can view appointments, write prescriptions, and check patient history.</p>
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
