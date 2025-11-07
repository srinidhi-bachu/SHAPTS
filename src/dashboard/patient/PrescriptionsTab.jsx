import React, { useMemo, useState } from "react";
import "./PrescriptionsTab.css";

export default function PrescriptionsTab() {
  const initial = useMemo(() => ([
    { id: 101, date: "2025-11-01", doctor: "Dr. Sharma", items: [
      { medicine: "Atorvastatin 10mg", dosage: "1 tab", duration: "30 days" },
      { medicine: "Aspirin 75mg", dosage: "1 tab", duration: "15 days" },
    ] },
    { id: 102, date: "2025-10-20", doctor: "Dr. Rao", items: [
      { medicine: "Metformin 500mg", dosage: "1 tab", duration: "60 days" },
    ] },
  ]), []);

  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem("patient_prescriptions");
      return saved ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });

  const [active, setActive] = useState(prescriptions[0]?.id || null);
  const current = prescriptions.find(p => p.id === active) || prescriptions[0];

  const download = () => {
    const blob = new Blob([JSON.stringify(current, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prescription_${current?.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printView = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<pre>${current ? JSON.stringify(current, null, 2) : ""}</pre>`);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="rx-wrap">
      <aside className="rx-list">
        <div className="rx-list-title">Your Prescriptions</div>
        {prescriptions.map(p => (
          <button key={p.id} className={`rx-item ${p.id === current?.id ? "active" : ""}`} onClick={() => setActive(p.id)}>
            <div className="rx-item-top">
              <span className="rx-id">#{p.id}</span>
              <span className="rx-date">{p.date}</span>
            </div>
            <div className="rx-doctor">{p.doctor}</div>
            <div className="rx-count">{p.items.length} item(s)</div>
          </button>
        ))}
      </aside>

      <section className="rx-detail">
        {current ? (
          <div className="rx-card">
            <div className="rx-card-head">
              <div>
                <div className="rx-title">Prescription #{current.id}</div>
                <div className="rx-sub">{current.date} • {current.doctor}</div>
              </div>
              <div className="rx-actions">
                <button className="rx-btn" onClick={download}>Download</button>
                <button className="rx-btn secondary" onClick={printView}>Print</button>
              </div>
            </div>
            <table className="rx-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {current.items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.medicine}</td>
                    <td>{it.dosage}</td>
                    <td>{it.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rx-empty">No prescription selected</div>
        )}
      </section>
    </div>
  );
}
