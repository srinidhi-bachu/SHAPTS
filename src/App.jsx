import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Landing from "./pages/Landing.jsx";
import Register from "./pages/register.jsx";
import AdminDashboard from "./dashboard/admin/adminDashboard.jsx";
import DoctorDashboard from "./dashboard/doctor/doctorDashboard.jsx";
import PatientDashboard from "./dashboard/patient/patientDashboard.jsx";
import BookingPage from "./dashboard/patient/BookingPage.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";


export default function App() {
    return (
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-dashboard/book" element={<BookingPage />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/register" element={<Register />} />
    </Routes>
);
}
