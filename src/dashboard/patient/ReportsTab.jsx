import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./ReportsTab.css";

const reports = [
  { id: 1, name: "CBC Report.pdf", date: "2025-10-02" },
  { id: 2, name: "X-Ray Chest.png", date: "2025-09-20" },
];

export default function ReportsTab() {
  return (
    <div className="pt-reports">
      <div className="pt-rep-hero">
        <DotLottieReact src="/Customised report.lottie" autoplay loop style={{ width: 160, height: 160 }} />
        <div>
          <h3>Your medical documents</h3>
          <p>Download or view lab results and prescriptions.</p>
        </div>
      </div>

      <div className="pt-rep-list">
        {reports.map((r) => (
          <div className="pt-card" key={r.id}>
            <div>
              <strong>{r.name}</strong>
              <div className="muted">Uploaded on {r.date}</div>
            </div>
            <div className="rep-actions">
              <button onClick={() => alert("Viewing "+r.name)}>View</button>
              <button onClick={() => alert("Downloading "+r.name)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
