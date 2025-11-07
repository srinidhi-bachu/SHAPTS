import React from "react";
import { useNavigate } from "react-router-dom";
import { DIRECTORY } from "./data";

export default function LocationsPage(){
  const nav = useNavigate();
  return (
    <div className="slide-up" style={{ padding: 16 }}>
      <div className="u-card" style={{ padding: 16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Browse Locations</h2>
            <div style={{ color:"var(--muted)" }}>Pick a city to view its hospitals</div>
          </div>
          <button className="u-btn" onClick={()=>nav(-1)}>← Back</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
          {DIRECTORY.locations.map(loc => (
            <button key={loc.name} className="u-card" onClick={()=>nav(`/patient-dashboard/locations/${encodeURIComponent(loc.name)}`)} style={{ padding: 16, textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{loc.name}</div>
              <div className="u-badge" style={{ marginTop: 8 }}>{loc.hospitals.length} hospital(s)</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
