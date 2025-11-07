import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DIRECTORY } from "./data";

export default function HospitalsPage(){
  const { loc } = useParams();
  const nav = useNavigate();
  const location = decodeURIComponent(loc || "");
  const data = useMemo(()=> DIRECTORY.locations.find(l=>l.name === location), [location]);

  if(!data){
    return (
      <div className="u-card" style={{ padding: 16, margin: 16 }}>
        <div style={{ marginBottom: 8 }}>No hospitals found for this location.</div>
        <button className="u-btn" onClick={()=>nav('/patient-dashboard/locations')}>Back to Locations</button>
      </div>
    );
  }

  return (
    <div className="slide-up" style={{ padding: 16 }}>
      <div className="u-card" style={{ padding: 16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 12 }}>
          <div>
            <div style={{ color:"var(--muted)" }}><button className="u-btn" onClick={()=>nav('/patient-dashboard/locations')} style={{ padding: '6px 10px', marginRight: 8 }}>←</button> {location}</div>
            <h2 style={{ margin: '6px 0 0 0' }}>Hospitals</h2>
          </div>
          <button className="u-btn" onClick={()=>nav(-1)}>Go Back</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {data.hospitals.map(h => (
            <button key={h.id} className="u-card" onClick={()=>nav(`/patient-dashboard/hospital/${encodeURIComponent(h.id)}`)} style={{ padding: 16, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{h.name}</div>
              <div className="u-badge" style={{ marginTop: 8 }}>{h.doctors.length} doctor(s)</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
