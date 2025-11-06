    import React, { useState } from "react";
    import Navbar from "./Navbar/Navbar";
    import SideNav from "./sidenav/SideNav";
    import styles from "./dashboardLayout.module.css";

    export default function DashboardLayout({ hero, content }) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("home");

    return (
        <div className={styles.wrap}>
        <Navbar toggleSidebar={() => setOpen((v) => !v)} />
        <SideNav isOpen={open} activeTab={tab} onChange={setTab} />

        <main className={`${styles.main} ${open ? styles.shift : ""}`}>
            {hero ? (React.isValidElement(hero) ? React.cloneElement(hero, { setTab }) : hero) : null}
            <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === "home" ? styles.active : ""}`} onClick={() => setTab("home")}>Home</button>
            <button className={`${styles.tab} ${tab === "appointments" ? styles.active : ""}`} onClick={() => setTab("appointments")}>Appointments</button>
            <button className={`${styles.tab} ${tab === "doctors" ? styles.active : ""}`} onClick={() => setTab("doctors")}>Search Doctor</button>
            <button className={`${styles.tab} ${tab === "reports" ? styles.active : ""}`} onClick={() => setTab("reports")}>Reports</button>
            <button className={`${styles.tab} ${tab === "feedback" ? styles.active : ""}`} onClick={() => setTab("feedback")}>Feedback</button>
            </div>
            <div className={styles.content}>
            {typeof content === "function" ? content(tab, setTab) : content}
            </div>
        </main>
        </div>
    );
    }
