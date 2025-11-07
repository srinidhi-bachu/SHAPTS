import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./BookingPage.css";
import AnimatedSearch from "../../components/AnimatedSearch/AnimatedSearch";
import AmbulanceButton from "../../components/AmbulanceButton/AmbulanceButton";

export default function BookingPage() {
  const [location, setLocation] = useState("Mumbai");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [loadingHosp, setLoadingHosp] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [doctorModal, setDoctorModal] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientNote, setPatientNote] = useState("");
  const noteRef = useRef(null);

  const topRef = useRef(null);
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("");
  const [lang, setLang] = useState("");
  const [fee, setFee] = useState(1000);
  const [sort, setSort] = useState("rating_desc");

  const locations = ["Mumbai", "Bengaluru", "Pune", "Delhi"];
  const hospitalsByCity = useMemo(() => ({
    Mumbai: [
      { id: "mh1", name: "CityCare Hospital", address: "Andheri East", rating: 4.6 },
      { id: "mh2", name: "Lotus Multispeciality", address: "Bandra West", rating: 4.4 },
    ],
    Bengaluru: [
      { id: "bl1", name: "GreenLeaf Hospital", address: "HSR Layout", rating: 4.5 },
      { id: "bl2", name: "TechCity Care", address: "Whitefield", rating: 4.3 },
    ],
    Pune: [
      { id: "pn1", name: "Horizon Clinic", address: "Baner", rating: 4.2 },
      { id: "pn2", name: "RiverSide Hospital", address: "Kalyani Nagar", rating: 4.5 },
    ],
    Delhi: [
      { id: "dl1", name: "Capital Health", address: "Saket", rating: 4.6 },
      { id: "dl2", name: "North Star Hospital", address: "Rohini", rating: 4.1 },
    ],
  }), []);

  // Doctors database by hospital (declare BEFORE suggestions that reference it)
  const doctorsByHospital = useMemo(() => ({
    mh1: [
      { id: "d11", name: "Dr. A. Mehta", spec: "Cardiologist", exp: 12, lang: ["EN", "HI"], fee: 800, rating: 4.7 },
      { id: "d12", name: "Dr. R. Kulkarni", spec: "Orthopedic", exp: 9, lang: ["EN", "MR"], fee: 600, rating: 4.5 },
    ],
    mh2: [
      { id: "d13", name: "Dr. S. Kapoor", spec: "Dermatologist", exp: 8, lang: ["EN", "HI"], fee: 650, rating: 4.4 },
    ],
    bl1: [
      { id: "d21", name: "Dr. P. Rao", spec: "Pediatrician", exp: 10, lang: ["EN", "KA"], fee: 700, rating: 4.6 },
      { id: "d22", name: "Dr. M. Iyer", spec: "ENT", exp: 7, lang: ["EN", "KA"], fee: 550, rating: 4.2 },
    ],
    bl2: [
      { id: "d23", name: "Dr. G. Nair", spec: "General Physician", exp: 11, lang: ["EN", "ML"], fee: 500, rating: 4.5 },
    ],
    pn1: [
      { id: "d31", name: "Dr. K. Deshmukh", spec: "Neurologist", exp: 13, lang: ["EN", "MR"], fee: 900, rating: 4.6 },
    ],
    pn2: [
      { id: "d32", name: "Dr. V. Patil", spec: "Dermatologist", exp: 6, lang: ["EN", "MR"], fee: 600, rating: 4.3 },
    ],
    dl1: [
      { id: "d41", name: "Dr. R. Khanna", spec: "Cardiologist", exp: 15, lang: ["EN", "HI"], fee: 1000, rating: 4.8 },
    ],
    dl2: [
      { id: "d42", name: "Dr. T. Anand", spec: "Orthopedic", exp: 9, lang: ["EN", "HI"], fee: 700, rating: 4.4 },
    ],
  }), []);

  // Heuristic: Map free-text note to a likely specialization
  const mapNoteToSpec = (t) => {
    const s = (t || "").toLowerCase();
    if (/heart|chest pain|chest discomfort|bp|cardiac/.test(s)) return "Cardiologist";
    if (/skin|rash|acne|eczema|derma/.test(s)) return "Dermatologist";
    if (/bone|joint|knee|fracture|back pain|shoulder/.test(s)) return "Orthopedic";
    if (/child|kid|pediatric|fever in child/.test(s)) return "Pediatrician";
    if (/(ear|nose|throat|sinus|tonsil)/.test(s)) return "ENT";
    if (/headache|migraine|seizure|epilepsy|stroke|neuro/.test(s)) return "Neurologist";
    if (/cough|cold|fever|general|weakness|fatigue/.test(s)) return "General Physician";
    return "";
  };

  // Flatten doctors for quick suggestion search
  const allDoctorsList = useMemo(() => Object.values(doctorsByHospital).flat(), [doctorsByHospital]);

  const suggestedSpec = useMemo(() => mapNoteToSpec(patientNote), [patientNote]);

  const suggestedDoctors = useMemo(() => {
    if (!suggestedSpec) return [];
    // Prefer current city hospitals first if chosen, else show top rating few
    const list = allDoctorsList.filter(d => d.spec === suggestedSpec);
    return list.sort((a,b)=> b.rating - a.rating).slice(0,4);
  }, [suggestedSpec, allDoctorsList]);

  const suggestedHospitals = useMemo(() => {
    // In the selected location, list hospitals (no server data about departments, so just show top 2)
    return (hospitalsByCity[location] || []).slice(0,2);
  }, [location, hospitalsByCity]);

  

  // Derived lists for filters (computed after doctorsByHospital is defined)
  const allSpecs = useMemo(() => {
    const s = new Set();
    Object.values(doctorsByHospital).flat().forEach(d => s.add(d.spec));
    return Array.from(s);
  }, [doctorsByHospital]);
  const allLangs = ["EN","HI","MR","KA","ML"];

  const days = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i=0;i<7;i++){
      const d = new Date(now);
      d.setDate(now.getDate()+i);
      arr.push({ key: d.toISOString().slice(0,10), label: d.toLocaleDateString(undefined,{ weekday:'short', month:'short', day:'numeric' }) });
    }
    return arr;
  }, []);
  const times = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","15:00","15:30","16:00"];

  // Read query params
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const loc = p.get("loc");
    const hosp = p.get("hospital");
    if (loc && locations.includes(loc)) setLocation(loc);
    if (hosp) setSelectedHospital(hosp);
  }, []);

  // Simulate loading
  useEffect(() => {
    setLoadingHosp(true);
    const t = setTimeout(() => setLoadingHosp(false), 300);
    return () => clearTimeout(t);
  }, [location]);
  useEffect(() => {
    if (!selectedHospital) return;
    setLoadingDocs(true);
    const t = setTimeout(() => setLoadingDocs(false), 350);
    return () => clearTimeout(t);
  }, [selectedHospital]);

  useEffect(()=>{ if(topRef.current){ try{ topRef.current.scrollIntoView({behavior:'smooth'});}catch{}}},[]);

  return (
    <div className="page" ref={topRef}>
      <div className="hero">
        <DotLottieReact src="/Marking a Calendar.lottie" autoplay loop style={{ width: 120, height: 120 }} />
        <div>
          <h2 style={{ margin: 0 }}>Book an appointment</h2>
          <p className="muted">Choose your location, pick a hospital and select a doctor & slot.</p>
        </div>
      </div>

      <div className="wrap">
        <div className="grid">
          <div>
            <h3 className="h">Select location</h3>
            <div className="chips">
              {locations.map((loc) => (
                <button key={loc} className={`chip ${location === loc ? 'on' : ''}`} onClick={() => { setLocation(loc); setSelectedHospital(''); }}>{loc}</button>
              ))}
            </div>

            <h3 className="h" style={{ marginTop: 12 }}>Hospitals in {location}</h3>
            <div className="list">
              {loadingHosp && <div className="muted">Loading hospitals…</div>}
              {!loadingHosp && hospitalsByCity[location].map(h => (
                <button key={h.id} className="card" onClick={() => setSelectedHospital(h.id)}>
                  <div>
                    <strong>{h.name}</strong>
                    <div className="muted">{h.address}</div>
                  </div>
                  <span className="badge">⭐ {h.rating}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label className="muted" htmlFor="bk-note">Describe your problem</label>
            <textarea
              id="bk-note"
              ref={noteRef}
              value={patientNote}
              onChange={(e)=>setPatientNote(e.target.value)}
              placeholder="e.g. Chest discomfort since morning"
              style={{ width:'100%', minHeight: 80, marginTop: 6, padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <h3 className="h">Recommended doctors</h3>
            <div className="list">
              {[{ id:'r1', name:'Dr. Priya Verma', spec:'Cardiologist', rating:4.9 }, { id:'r2', name:'Dr. Arjun Rao', spec:'Dermatologist', rating:4.8 }].map(d => (
                <div key={d.id} className="card">
                  <div className="docL">
                    <div className="avatar">{d.name.split(' ').slice(-1)[0][0]}</div>
                    <div>
                      <strong>{d.name}</strong>
                      <div className="muted">{d.spec}</div>
                      <span className="avail">Available today</span>
                    </div>
                  </div>
                  <div className="actions">
                    <span className="badge">⭐ {d.rating}</span>
                    <Link to={`/doctor/${d.id}`} className="ghost" style={{ textDecoration: 'none' }}>View profile</Link>
                    <button
                      className="primary"
                      onClick={() => {
                        if (!patientNote.trim()) {
                          alert("Please describe your problem before booking.");
                          try { noteRef.current?.focus(); noteRef.current?.scrollIntoView({ behavior:'smooth', block:'center' }); } catch {}
                          return;
                        }
                        setDoctorModal({ doctor: d, hospitalId: selectedHospital });
                      }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions based on the described problem */}
        {patientNote.trim() && (
          <div className="list" style={{ gridColumn: '1 / -1' }}>
            <div className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                <div>
                  <strong>Suggestions based on your problem</strong>
                  <div className="muted">{suggestedSpec ? `Suggested specialization: ${suggestedSpec}` : 'Tell us more to refine suggestions'}</div>
                </div>
                {suggestedSpec && (
                  <span className="badge">Specialization: {suggestedSpec}</span>
                )}
              </div>

              {suggestedSpec && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
                  <div>
                    <div className="muted" style={{ marginBottom:6 }}>Suggested doctors</div>
                    {(suggestedDoctors.length ? suggestedDoctors : [{id:'s1',name:`Top ${suggestedSpec}`,spec:suggestedSpec,rating:4.5}]).map(d => (
                      <div key={d.id} className="doc" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #eef2f7' }}>
                        <div className="docL" style={{ display:'flex', gap:10, alignItems:'center' }}>
                          <div className="avatar">{(d.name||'Dr').split(' ').slice(-1)[0][0]}</div>
                          <div>
                            <strong>{d.name}</strong>
                            <div className="muted">{d.spec}</div>
                          </div>
                        </div>
                        <div className="actions" style={{ display:'flex', gap:8, alignItems:'center' }}>
                          {d.rating && <span className="badge">⭐ {d.rating}</span>}
                          <Link to={`/doctor/${d.id}`} className="ghost" style={{ textDecoration:'none' }}>View</Link>
                          <button
                            className="primary"
                            onClick={() => {
                              if (!patientNote.trim()) { try{ noteRef.current?.focus(); }catch{}; return; }
                              setDoctorModal({ doctor: d, hospitalId: selectedHospital });
                            }}
                          >Book</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="muted" style={{ marginBottom:6 }}>Hospitals in {location}</div>
                    {suggestedHospitals.map(h => (
                      <button key={h.id} className="card" onClick={() => setSelectedHospital(h.id)}>
                        <div>
                          <strong>{h.name}</strong>
                          <div className="muted">{h.address}</div>
                        </div>
                        <span className="badge">⭐ {h.rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedHospital && (
          <div className="docs">
            <h3 className="h">Doctors at selected hospital</h3>
            <div className="filters">
              <AnimatedSearch value={q} onChange={setQ} placeholder="Search doctor or specialty" />
              <select value={spec} onChange={(e)=>setSpec(e.target.value)}>
                <option value="">All specializations</option>
                {allSpecs.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={lang} onChange={(e)=>setLang(e.target.value)}>
                <option value="">Any language</option>
                {allLangs.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <div className="range">
                <label className="muted">Max fee</label>
                <input type="range" min="300" max="1500" step="50" value={fee} onChange={(e)=>setFee(parseInt(e.target.value))} />
                <span className="badge">₹ {fee}</span>
              </div>
              <select className="sort" value={sort} onChange={(e)=>setSort(e.target.value)}>
                <option value="rating_desc">Top rated</option>
                <option value="fee_asc">Fee: Low to high</option>
                <option value="fee_desc">Fee: High to low</option>
                <option value="exp_desc">Experience</option>
              </select>
            </div>
            {loadingDocs && <div className="muted">Loading doctors…</div>}
            {!loadingDocs && (
              <div className="docgrid">
                {(() => {
                  let list = (doctorsByHospital[selectedHospital]||[]).slice();
                  if (q) list = list.filter(d => (d.name+" "+d.spec).toLowerCase().includes(q.toLowerCase()));
                  if (spec) list = list.filter(d => d.spec === spec);
                  if (lang) list = list.filter(d => d.lang.includes(lang));
                  list = list.filter(d => d.fee <= fee);
                  if (sort === 'rating_desc') list.sort((a,b)=> b.rating - a.rating);
                  if (sort === 'fee_asc') list.sort((a,b)=> a.fee - b.fee);
                  if (sort === 'fee_desc') list.sort((a,b)=> b.fee - a.fee);
                  if (sort === 'exp_desc') list.sort((a,b)=> b.exp - a.exp);
                  return list;
                })().map((d) => (
                  <div key={d.id} className="doc">
                    <div className="docL">
                      <div className="avatar">{d.name.split(' ').slice(-1)[0][0]}</div>
                      <div>
                        <strong>{d.name}</strong>
                        <div className="muted">{d.spec} • {d.exp} yrs exp</div>
                        <div className="muted">Languages: {d.lang.join(', ')}</div>
                        <div style={{ marginTop: 6 }}>
                          {(d.rating >= 4.6) ? <span className="avail">Available today</span> : <span className="busy">Waitlist 1-2 days</span>}
                        </div>
                      </div>
                    </div>
                    <div className="actions">
                      <span className="badge">⭐ {d.rating}</span>
                      <span className="badge">₹ {d.fee}</span>
                      <Link to={`/doctor/${d.id}`} className="ghost" style={{ textDecoration: 'none' }}>View profile</Link>
                      <button
                        className="primary"
                        onClick={() => {
                          if (!patientNote.trim()) {
                            alert("Please describe your problem before booking.");
                            try { noteRef.current?.focus(); noteRef.current?.scrollIntoView({ behavior:'smooth', block:'center' }); } catch {}
                            return;
                          }
                          setDoctorModal({ doctor: d, hospitalId: selectedHospital });
                        }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {doctorModal && (
        <div className="modal">
          <div className="modalCard" role="dialog" aria-modal="true">
            <div className="modalHead">
              <strong>{doctorModal.doctor.name}</strong>
              <button className="icon" onClick={() => { setDoctorModal(null); setSelectedSlot(''); }}>✕</button>
            </div>
            <div className="muted">{doctorModal.doctor.spec || 'General'} • {doctorModal.doctor.exp || 10} yrs exp</div>
            <div className="muted" style={{ marginTop: 4 }}>Rating ⭐ {doctorModal.doctor.rating || 4.5}</div>

            <div className="slots">
              <div className="days">
                {days.map(d => (
                  <button key={d.key} className={`chip ${selectedSlot.startsWith(d.key) ? 'on' : ''}`} onClick={() => setSelectedSlot(`${d.key} 09:00`)}>{d.label}</button>
                ))}
              </div>
              <div className="times">
                {["09:00","09:30","10:00","10:30","11:00","11:30","12:00","15:00","15:30","16:00"].map(t => (
                  <button key={t} className={`chip ${selectedSlot.endsWith(` ` + t) ? 'on' : ''}`} onClick={() => {
                    const base = selectedSlot.split(' ')[0] || days[0].key; setSelectedSlot(`${base} ${t}`);
                  }}>{t}</button>
                ))}
              </div>
            </div>

            <div className="modalActions">
              <button className="ghost" onClick={() => { setDoctorModal(null); setSelectedSlot(''); }}>Cancel</button>
              <AmbulanceButton
                label="Confirm booking"
                successLabel="Booked"
                canStart={() => !!selectedSlot}
                onComplete={() => {
                  if (!selectedSlot) return; // guard
                  try {
                    const [date, time] = selectedSlot.split(" ");
                    const payload = {
                      id: Date.now(),
                      doctor: doctorModal.doctor.name,
                      date,
                      time,
                      status: "Booked",
                      note: patientNote || "",
                    };
                    localStorage.setItem("pt:lastBooking", JSON.stringify(payload));
                  } catch {}
                  alert(`Booked ${doctorModal.doctor.name} on ${selectedSlot}`);
                  setDoctorModal(null);
                  setSelectedSlot('');
                  setPatientNote('');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
