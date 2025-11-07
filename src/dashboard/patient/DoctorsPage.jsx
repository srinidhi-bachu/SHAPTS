import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DIRECTORY } from "./data";

function findHospitalById(id){
  for(const loc of DIRECTORY.locations){
    const hosp = loc.hospitals.find(h=>h.id===id);
    if(hosp) return { location: loc.name, hospital: hosp };
  }
  return null;
}

export default function DoctorsPage(){
  const { hid } = useParams();
  const nav = useNavigate();
  const ctx = useMemo(()=> findHospitalById(decodeURIComponent(hid||"")), [hid]);
  if(!ctx){
    return (
      <div className="u-card" style={{ padding: 16, margin: 16 }}>
        <div style={{ marginBottom: 8 }}>Hospital not found.</div>
        <button className="u-btn" onClick={()=>nav('/patient-dashboard/locations')}>Back to Locations</button>
      </div>
    );
  }
  const { location, hospital } = ctx;
  return (
    <div className="slide-up" style={{ padding: 16 }}>
      <div className="u-card" style={{ padding: 16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 12 }}>
          <div>
            <div style={{ color:"var(--muted)" }}>
              <button className="u-btn" onClick={()=>nav('/patient-dashboard/locations')} style={{ padding: '6px 10px', marginRight: 8 }}>←</button>
              {location} • {hospital.name}
            </div>
            <h2 style={{ margin: '6px 0 0 0' }}>Doctors</h2>
          </div>
          <button className="u-btn" onClick={()=>nav(-1)}>Go Back</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
          {hospital.doctors.map(d => (
            <div key={d.id} className="u-card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{d.name}</div>
                <div className="u-badge" style={{ marginTop: 6 }}>{d.specialization}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="u-btn" onClick={()=>nav(`/patient-dashboard/doctor/${d.id}`)}>View</button>
                <button className="u-btn primary" onClick={()=>nav('/patient-dashboard/book')}>Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
