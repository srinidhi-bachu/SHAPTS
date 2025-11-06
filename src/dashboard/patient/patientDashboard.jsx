    import React, { useState } from "react";
    import { DotLottieReact } from "@lottiefiles/dotlottie-react";
    import "./patientDashboard.css";

    export default function PatientDashboard() {
    const [activeSection, setActiveSection] = useState("appointments");

    const renderContent = () => {
        switch (activeSection) {
        case "appointments":
            return (
            <div className="content-section fade-in">
                <h3>📅 Upcoming Appointments</h3>
                <table className="data-table">
                <thead>
                    <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>12 Nov 2025</td>
                    <td>Dr. Priya</td>
                    <td>Cardiology</td>
                    <td>Confirmed</td>
                    </tr>
                    <tr>
                    <td>20 Nov 2025</td>
                    <td>Dr. Arjun</td>
                    <td>Dermatology</td>
                    <td>Pending</td>
                    </tr>
                </tbody>
                </table>
                <button className="primary-btn">Book New Appointment</button>
            </div>
            );

        case "search":
            return (
            <div className="content-section fade-in">
                <h3>🔍 Find Your Doctor</h3>
                <input
                type="text"
                className="search-input"
                placeholder="Search doctor, specialization, or hospital..."
                />
                <div className="doctor-cards">
                {[
                    { name: "Dr. Kavya", field: "Neurology", exp: "8 Years", rating: 4.8 },
                    { name: "Dr. Ramesh", field: "Orthopedics", exp: "10 Years", rating: 4.7 },
                    { name: "Dr. Anjali", field: "Pediatrics", exp: "6 Years", rating: 4.9 },
                ].map((doc, i) => (
                    <div key={i} className="doctor-card">
                    <DotLottieReact src="/search-doctor.lottie" autoplay loop style={{ width: "80px" }} />
                    <h4>{doc.name}</h4>
                    <p>{doc.field}</p>
                    <p>{doc.exp}</p>
                    <p>⭐ {doc.rating}</p>
                    <button className="small-btn">Book Now</button>
                    </div>
                ))}
                </div>
            </div>
            );

        case "reports":
            return (
            <div className="content-section fade-in">
                <h3>📑 Medical Records</h3>
                <ul className="report-list">
                <li>Blood Test - Oct 2025</li>
                <li>ECG - Sept 2025</li>
                <li>Doctor Prescription - Aug 2025</li>
                </ul>
                <button className="primary-btn">Download Reports</button>
            </div>
            );

        case "feedback":
            return (
            <div className="content-section fade-in">
                <h3>⭐ Share Your Feedback</h3>
                <textarea placeholder="Write your feedback here..." />
                <button className="primary-btn">Submit Feedback</button>
            </div>
            );

        default:
            return null;
        }
    };

    return (
        <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
            <h2>🏥 SHAPTS</h2>
            <ul>
            <li>🏠 Dashboard</li>
            <li>📁 My Records</li>
            <li>🧾 Prescriptions</li>
            <li>⚙️ Settings</li>
            <li className="logout">🚪 Logout</li>
            </ul>
        </aside>

        {/* Main Section */}
        <main className="main-area">
            {/* Top Navbar */}
            <nav className="topbar">
            <h3>Welcome, Murali 👋</h3>
            <div className="nav-tabs">
                <button onClick={() => setActiveSection("appointments")} className={activeSection === "appointments" ? "active" : ""}>Appointments</button>
                <button onClick={() => setActiveSection("search")} className={activeSection === "search" ? "active" : ""}>Search Doctor</button>
                <button onClick={() => setActiveSection("reports")} className={activeSection === "reports" ? "active" : ""}>Reports</button>
                <button onClick={() => setActiveSection("feedback")} className={activeSection === "feedback" ? "active" : ""}>Feedback</button>
            </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
            <div className="hero-text">
                <h2>Your Health, Our Priority ❤️</h2>
                <p>Track appointments, view reports, and stay connected to your doctors seamlessly.</p>
            </div>
            <DotLottieReact src="/patient-banner.lottie" autoplay loop style={{ width: "300px" }} />
            </section>

            {/* Dynamic Content */}
            {renderContent()}

            {/* Recommendations */}
            <section className="recommendations fade-in">
            <h3>🏥 Recommended Hospitals</h3>
            <div className="hospital-grid">
                <div className="hospital-card">Apollo Hospitals</div>
                <div className="hospital-card">AIIMS New Delhi</div>
                <div className="hospital-card">Rainbow Children’s Hospital</div>
            </div>
            </section>
        </main>
        </div>
    );
    }
