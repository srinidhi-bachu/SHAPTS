    import React, { useEffect } from "react";
    import "./patientDashboard.css";
    import HeroBanner from "./heroBanner";
    import DashboardLayout from "../../components/dashboardLayout";
    import AppointmentsTab from "./AppointmentsTab";
    import DoctorsTab from "./DoctorsTab";
    import ReportsTab from "./ReportsTab";
    import PrescriptionsTab from "./PrescriptionsTab";
    import FeedbackTab from "./FeedbackTab";
    import HomeSection from "./HomeSection";

    export default function PatientDashboard() {
    const userName = localStorage.getItem("userName");
    useEffect(() => {
        const r = (localStorage.getItem("role") || "").toLowerCase();
        if (r && r !== "patient") {
        window.location.href = "/";
        }
    }, []);

    return (
        <DashboardLayout
        hero={<HeroBanner
            userName={userName}
            onBookAppointments={(setTab)=> setTab && setTab("appointments")}
            onViewReports={(setTab)=> setTab && setTab("reports")}
        />}
        content={(tab, setTab) => {
            if (tab === "appointments") return <AppointmentsTab />;
            if (tab === "doctors") return <DoctorsTab />;
            if (tab === "reports") return <ReportsTab />;
            if (tab === "prescriptions") return <PrescriptionsTab />;
            if (tab === "feedback") return <FeedbackTab />;
            return <HomeSection setTab={setTab} />;
        }}
        />
    );
    }
