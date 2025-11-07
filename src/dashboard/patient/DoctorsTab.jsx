import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./DoctorsTab.css";
import AnimatedSearch from "../../components/AnimatedSearch/AnimatedSearch";

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
