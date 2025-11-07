import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DIRECTORY } from "./data";

export default function DoctorsSearchPage(){
  const nav = useNavigate();
  const params = useMemo(()=> new URLSearchParams(window.location.search), []);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [hospital, setHospital] = useState("");
  const [spec, setSpec] = useState("");
  const [sort, setSort] = useState("name");

  useEffect(()=>{
    const qv = params.get("q") || "";
    const loc = params.get("loc") || "";
    const h = params.get("h") || "";
    const sp = params.get("spec") || "";
    const so = params.get("sort") || "name";
    setQ(qv);
    setLocation(loc);
    setHospital(h);
    setSpec(sp);
    setSort(so);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locations = useMemo(()=> DIRECTORY.locations.map(l=>l.name), []);
  const hospitals = useMemo(()=>{
    const loc = DIRECTORY.locations.find(l=>l.name===location);
    return loc ? loc.hospitals : [];
  }, [location]);

  const allDoctors = useMemo(()=>{
    const items = [];
    for(const loc of DIRECTORY.locations){
      for(const hosp of loc.hospitals){
        for(const d of hosp.doctors){
          items.push({ ...d, _location: loc.name, _hospitalId: hosp.id, _hospital: hosp.name });
        }
      }
    }
    return items;
  }, []);

  const results = useMemo(()=>{
    let arr = allDoctors;
    if(location) arr = arr.filter(d=>d._location===location);
    if(hospital) arr = arr.filter(d=>d._hospitalId===hospital);
    if(spec) arr = arr.filter(d=>d.specialization.toLowerCase().includes(spec.toLowerCase()));
    if(q) arr = arr.filter(d=>d.name.toLowerCase().includes(q.toLowerCase()));

    if(sort === "name") arr = [...arr].sort((a,b)=>a.name.localeCompare(b.name));
    else if(sort === "experience") arr = [...arr].sort((a,b)=>(b.experience||0)-(a.experience||0));

    return arr;
  }, [allDoctors, location, hospital, spec, q, sort]);

  return (
    <div className="slide-up" style={{ padding: 16 }}>
      <div className="u-card" style={{ padding: 16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap: 12, marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Find Doctors</h2>
            <div style={{ color: "var(--muted)" }}>Search, filter and sort across all hospitals</div>
          </div>
          <button className="u-btn" onClick={()=>nav(-1)}>← Back</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 180px 220px 1fr 160px", gap: 8, marginBottom: 12 }}>
          <div className="search-animated" style={{ maxWidth: 420 }}>
            <label htmlFor="ds-search">Search</label>
            <input id="ds-search" className="search-input" type="search" placeholder="Search by doctor name" value={q} onChange={(e)=>setQ(e.target.value)} />
            <span className="caret" />
          </div>
          <select value={location} onChange={(e)=>{ setLocation(e.target.value); setHospital(""); }}>
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={hospital} onChange={(e)=>setHospital(e.target.value)} disabled={!location}>
            <option value="">All Hospitals</option>
            {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
          <input placeholder="Specialization" value={spec} onChange={(e)=>setSpec(e.target.value)} />
          <select value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="name">Sort: Name</option>
            <option value="experience">Sort: Experience</option>
          </select>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
          {results.map(d => (
            <div key={d.id} className="u-card" style={{ padding: 14, display:"flex", gap: 12, alignItems: 'center' }}>
              <img src={d.photo} alt={d.name} width={64} height={64} style={{ borderRadius: 12, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{d.name}</div>
                <div className="u-badge" style={{ marginTop: 6 }}>{d.specialization}</div>
                <div style={{ color:'var(--muted)', marginTop: 6 }}>{d._location} • <button className="link" onClick={()=>nav(`/patient-dashboard/hospital/${d._hospitalId}`)}>{d._hospital}</button></div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
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
