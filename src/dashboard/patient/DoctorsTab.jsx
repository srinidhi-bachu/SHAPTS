import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./DoctorsTab.css";

const allDoctors = [
  { id: 1, name: "Dr. Priya Verma", specialization: "Cardiologist", location: "Mumbai" },
  { id: 2, name: "Dr. Arjun Rao", specialization: "Dermatologist", location: "Bengaluru" },
  { id: 3, name: "Dr. Sneha Iyer", specialization: "Pediatrician", location: "Pune" },
];

export default function DoctorsTab() {
  const [filters, setFilters] = useState({ specialization: "", location: "" });

  const filtered = allDoctors.filter((d) =>
    (filters.specialization ? d.specialization.toLowerCase().includes(filters.specialization.toLowerCase()) : true) &&
    (filters.location ? d.location.toLowerCase().includes(filters.location.toLowerCase()) : true)
  );

  return (
    <div className="pt-doc">
      <div className="pt-doc-hero">
        <DotLottieReact src="/Search Doctor.lottie" autoplay loop style={{ width: 160, height: 160 }} />
        <div>
          <h3>Find the right doctor</h3>
          <p>Filter by specialization and location.</p>
        </div>
      </div>

      <div className="pt-filters">
        <input placeholder="Specialization" value={filters.specialization} onChange={(e)=>setFilters({...filters, specialization: e.target.value})} />
        <input placeholder="Location" value={filters.location} onChange={(e)=>setFilters({...filters, location: e.target.value})} />
      </div>

      <div className="pt-doc-list">
        {filtered.map((d) => (
          <div className="pt-card" key={d.id}>
            <div>
              <strong>{d.name}</strong>
              <div className="muted">{d.specialization} • {d.location}</div>
            </div>
            <button className="book-btn" onClick={() => alert("Booked with "+d.name)}>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
}
