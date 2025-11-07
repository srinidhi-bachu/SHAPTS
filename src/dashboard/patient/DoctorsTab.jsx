import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./DoctorsTab.css";
import AnimatedSearch from "../../components/AnimatedSearch/AnimatedSearch";

const DATA = {
  locations: [
    {
      name: "Mumbai",
      hospitals: [
        { id: "h1", name: "City Care Hospital", doctors: [
          { id: "d1", name: "Dr. Priya Verma", specialization: "Cardiologist" },
          { id: "d2", name: "Dr. Rohan Mehta", specialization: "Orthopedic" },
        ]}
      ]
    },
    {
      name: "Bengaluru",
      hospitals: [
        { id: "h2", name: "Green Valley Clinic", doctors: [
          { id: "d3", name: "Dr. Arjun Rao", specialization: "Dermatologist" },
        ]}
      ]
    },
    {
      name: "Pune",
      hospitals: [
        { id: "h3", name: "Lotus Health Center", doctors: [
          { id: "d4", name: "Dr. Sneha Iyer", specialization: "Pediatrician" },
        ]}
      ]
    }
  ]
};

export default function DoctorsTab() {
  const nav = useNavigate();
  const [location, setLocation] = useState("");
  const [hospital, setHospital] = useState("");
  const [spec, setSpec] = useState("");

  const locations = useMemo(() => DATA.locations.map(l => l.name), []);
  const hospitals = useMemo(() => {
    const loc = DATA.locations.find(l => l.name === location);
    return loc ? loc.hospitals : [];
  }, [location]);
  const doctors = useMemo(() => {
    const hosp = hospitals.find(h => h.id === hospital);
    const list = hosp ? hosp.doctors : [];
    return spec ? list.filter(d=>d.specialization.toLowerCase().includes(spec.toLowerCase())) : list;
  }, [hospitals, hospital, spec]);

  return (
    <div className="pt-doc">
      <div className="pt-doc-hero">
        <DotLottieReact src="/Search Doctor.lottie" autoplay loop style={{ width: 160, height: 160 }} />
        <div>
          <h3>Find doctors by hospital</h3>
          <p>Select a location, choose a hospital, then view doctors. Click a doctor to see full details.</p>
        </div>
      </div>

      <div className="pt-filters">

        <AnimatedSearch
          value={filters.specialization}
          onChange={(v)=>setFilters({...filters, specialization: v})}
          placeholder="Specialization"
          id="spec-search"
        />
        <AnimatedSearch
          value={filters.location}
          onChange={(v)=>setFilters({...filters, location: v})}
          placeholder="Location"
          id="loc-search"
        />
        <select value={location} onChange={(e)=>{ setLocation(e.target.value); setHospital(""); }}>
          <option value="">Select Location</option>
          {locations.map(l => (<option key={l} value={l}>{l}</option>))}
        </select>
        <select value={hospital} onChange={(e)=> setHospital(e.target.value)} disabled={!location}>
          <option value="">Select Hospital</option>
          {hospitals.map(h => (<option key={h.id} value={h.id}>{h.name}</option>))}
        </select>
        <div className="search-animated" style={{ maxWidth: 280 }}>
          <label htmlFor="dt-search">Search</label>
          <input id="dt-search" className="search-input" type="search" placeholder="Filter by specialization" pattern=".\S." required value={spec} onChange={(e)=>setSpec(e.target.value)} />
          <span className="caret" />
        </div>

      </div>

      {!location && (
        <div className="hint">Please select a location to see hospitals.</div>
      )}
      {location && !hospital && (
        <div className="pt-hosp-list">
          {hospitals.map(h => (
            <button key={h.id} className="pt-hosp-card" onClick={()=>setHospital(h.id)}>
              <div className="title">{h.name}</div>
              <div className="muted">{h.doctors.length} doctor(s)</div>
            </button>
          ))}
        </div>
      )}

      {location && hospital && (
        <div className="pt-doc-list">
          {doctors.map((d) => (
            <div className="pt-card" key={d.id}>
              <div>
                <strong>{d.name}</strong>
                <div className="muted">{d.specialization}</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button className="book-btn" onClick={() => nav(`/patient-dashboard/doctor/${d.id}`)}>View</button>
                <button className="book-btn secondary" onClick={() => {
                  const qs = new URLSearchParams({ loc: location || "", hospital: hospital || "" }).toString();
                  nav(`/patient-dashboard/book?${qs}`);
                }}>Book</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
