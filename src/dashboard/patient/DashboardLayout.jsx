import React, { useState } from "react";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import "./DashboardLayout.css";

export default function DashboardLayout({ hero, content }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("home");

  return (
    <div className="pt-layout">
      <TopNav onToggleSidebar={() => setOpen((v) => !v)} />
      <SideNav isOpen={open} activeTab={tab} onChange={setTab} />

      <main className={`pt-main ${open ? "shift" : ""}`}>
        {hero ? (React.isValidElement(hero) ? React.cloneElement(hero, { setTab }) : hero) : null}
        <div className="pt-tabs">
          <button className={`pt-tab ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}>Home</button>
          <button className={`pt-tab ${tab === "appointments" ? "active" : ""}`} onClick={() => setTab("appointments")}>Appointments</button>
          <button className={`pt-tab ${tab === "doctors" ? "active" : ""}`} onClick={() => setTab("doctors")}>Search Doctor</button>
          <button className={`pt-tab ${tab === "reports" ? "active" : ""}`} onClick={() => setTab("reports")}>Reports</button>
          <button className={`pt-tab ${tab === "feedback" ? "active" : ""}`} onClick={() => setTab("feedback")}>Feedback</button>
        </div>
        <div className="pt-content">
          {content(tab)}
        </div>
      </main>
    </div>
  );
}
