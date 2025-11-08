import React, { useEffect, useMemo, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./AppointmentsTab.css";

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Sharma", date: "2025-11-10", time: "10:30 AM", status: "Booked" },
    { id: 2, doctor: "Dr. Rao", date: "2025-11-12", time: "12:00 PM", status: "Booked" },
  ]);

  // Booking flow state
  const [bookingOpen, setBookingOpen] = useState(() => {
    try { return localStorage.getItem("startBooking") === "1"; } catch { return false; }
  });
  const [location, setLocation] = useState("Mumbai");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [loadingHosp, setLoadingHosp] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [doctorModal, setDoctorModal] = useState(null); // {doctor, hospitalId}
  const [selectedSlot, setSelectedSlot] = useState("");
  const bookRef = useRef(null);
  const days = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i=0;i<7;i++){
      const d = new Date(now);
      d.setDate(now.getDate()+i);
      arr.push({
        key: d.toISOString().slice(0,10),
        label: d.toLocaleDateString(undefined,{ weekday:'short', month:'short', day:'numeric' })
      });
    }
    return arr;
  }, []);
  const times = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","15:00","15:30","16:00"];

  const confirmBooking = () => {
    if (!doctorModal || !selectedSlot) return alert("Pick a slot to continue");
    const [date, time] = selectedSlot.split(" ");
    setAppointments(prev => ([...prev, {
      id: prev.length ? prev[prev.length-1].id + 1 : 1,
      doctor: doctorModal.doctor.name,
      date,
      time,
      status: "Booked"
    }]));
    setDoctorModal(null);
    setSelectedSlot("");
    alert(`Booked ${doctorModal.doctor.name} on ${selectedSlot}`);
  };

  // Ingest last booking made on BookingPage (includes optional note)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pt:lastBooking");
      if (!raw) return;
      const b = JSON.parse(raw);
      setAppointments((prev) => {
        if (prev.some((x) => x.id === b.id)) return prev;
        return [...prev, { id: b.id, doctor: b.doctor, date: b.date, time: b.time, status: b.status || "Booked", note: b.note || "" }];
      });
    } catch {}
  }, []);

  // Mock data
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

  const prevVisited = [
    { id: "pr1", name: "Dr. Sharma", spec: "Cardiologist", last: "Aug 2025", rating: 4.7 },
    { id: "pr2", name: "Dr. Rao", spec: "Dermatologist", last: "Sep 2025", rating: 4.5 },
  ];

  const topRatedNearby = [
    { id: "tr1", name: "Dr. Priya Verma", spec: "Cardiologist", rating: 4.9 },
    { id: "tr2", name: "Dr. Arjun Rao", spec: "Dermatologist", rating: 4.8 },
  ];

  // URL param/hash support: ?startBooking=1&loc=Mumbai&hospital=mh1 and #book
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const want = p.get("startBooking") === "1";
      const loc = p.get("loc");
      const hosp = p.get("hospital");
      if (want) setBookingOpen(true);
      if (loc && locations.includes(loc)) setLocation(loc);
      if (hosp) setSelectedHospital(hosp);
      if (window.location.hash === "#book") setBookingOpen(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (bookingOpen) {
      try { localStorage.removeItem("startBooking"); } catch {}
    }
  }, [bookingOpen]);

  // Simulate loading for hospitals/doctors when location or hospital changes
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

  // Smooth scroll to booking panel when it opens
  useEffect(() => {
    if (bookingOpen && bookRef.current) {
      // next tick to ensure layout
      setTimeout(() => {
        try { bookRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
      }, 0);
    }
  }, [bookingOpen]);

  return (
    <div className="pt-app">
      <div className="pt-app-hero pt-hero-card">
        <DotLottieReact src="/Marking a Calendar.lottie" autoplay loop style={{ width: 140, height: 140 }} />
        <div>
          <h3>Manage your appointments</h3>
          <p>Book, reschedule or cancel with one click.</p>
          <div className="stats">
            {(() => {
              const today = new Date().toISOString().slice(0,10);
              const upcoming = appointments.filter(a => a.date >= today).length;
              const past = appointments.filter(a => a.date < today).length;
              return (
                <>
                  <span className="stat"><span className="num">{upcoming}</span> Upcoming</span>
                  <span className="stat alt"><span className="num">{past}</span> Past</span>
                </>
              );
            })()}
          </div>
          <div className="pt-hero-actions">
            <a className="btn-link" href="/patient-dashboard/book">Go to booking →</a>
          </div>
        </div>
      </div>

      <div className="pt-app-actions" style={{ display: 'none' }} />

      {false && (
        <div id="book" ref={bookRef} className="bk-panel">
          <div className="bk-row">
            <div className="bk-col">
              <h4>Select location</h4>
              <div className="chips">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    className={`chip ${location === loc ? "on" : ""}`}
                    onClick={() => { setLocation(loc); setSelectedHospital(""); }}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <h4 style={{ marginTop: 10 }}>Hospitals in {location}</h4>
              <div className="hosp-list">
                {loadingHosp && <div className="sk">Loading hospitals…</div>}
                {!loadingHosp && hospitalsByCity[location].length === 0 && (
                  <div className="muted">No hospitals found.</div>
                )}
                {!loadingHosp && hospitalsByCity[location].map((h) => (
                  <button
                    key={h.id}
                    className={`hosp ${selectedHospital === h.id ? "active" : ""}`}
                    onClick={() => setSelectedHospital(h.id)}
                  >
                    <div>
                      <strong>{h.name}</strong>
                      <div className="muted">{h.address}</div>
                    </div>
                    <span className="badge">⭐ {h.rating}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bk-col">
              <h4>Recommended doctors</h4>
              <div className="rec-doctors">
                {prevVisited.map((d) => (
                  <div key={d.id} className="rec-doc">
                    <div>
                      <strong>{d.name}</strong>
                      <div className="muted">Previously visited • {d.last}</div>
                    </div>
                    <div className="rcol">
                      <span className="badge">⭐ {d.rating}</span>
                      <button onClick={() => alert(`Booked with ${d.name}`)}>Book</button>
                    </div>
                  </div>
                ))}
                {topRatedNearby.map((d) => (
                  <div key={d.id} className="rec-doc">
                    <div>
                      <strong>{d.name}</strong>
                      <div className="muted">Highly rated • {d.spec}</div>
                    </div>
                    <div className="rcol">
                      <span className="badge">⭐ {d.rating}</span>
                      <button onClick={() => alert(`Booked with ${d.name}`)}>Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedHospital && (
            <div className="doc-cards">
              <h4>Doctors at selected hospital</h4>
              {loadingDocs && <div className="sk">Loading doctors…</div>}
              {!loadingDocs && (
                <div className="doc-grid">
                  {doctorsByHospital[selectedHospital]?.map((d) => (
                    <div key={d.id} className="doc-card">
                      <div className="doc-meta">
                        <strong>{d.name}</strong>
                        <div className="muted">{d.spec} • {d.exp} yrs exp</div>
                        <div className="muted">Languages: {d.lang.join(", ")}</div>
                      </div>
                      <div className="doc-actions">
                        <span className="badge">⭐ {d.rating}</span>
                        <span className="badge">₹ {d.fee}</span>
                        <button onClick={() => setDoctorModal({ doctor: d, hospitalId: selectedHospital })}>Book</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {false && (
        <div className="modal">
          <div className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-head">
              <strong>{doctorModal.doctor.name}</strong>
              <button className="icon-btn" aria-label="Close" onClick={() => { setDoctorModal(null); setSelectedSlot(""); }}>✕</button>
            </div>
            <div className="muted">{doctorModal.doctor.spec} • {doctorModal.doctor.exp} yrs exp • Languages: {doctorModal.doctor.lang.join(", ")}</div>
            <div className="muted" style={{ marginTop: 4 }}>Rating ⭐ {doctorModal.doctor.rating} • Fee ₹ {doctorModal.doctor.fee}</div>

            <div className="slots">
              <div className="days">
                {days.map(d => (
                  <button key={d.key} className={`chip ${selectedSlot.startsWith(d.key) ? 'on' : ''}`} onClick={() => setSelectedSlot(`${d.key} 09:00`)}>{d.label}</button>
                ))}
              </div>
              <div className="times">
                {times.map(t => (
                  <button key={t} className={`chip ${selectedSlot.endsWith(` ${t}`) ? 'on' : ''}`} onClick={() => {
                    const base = selectedSlot.split(' ')[0] || days[0].key;
                    setSelectedSlot(`${base} ${t}`);
                  }}>{t}</button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="ghost" onClick={() => { setDoctorModal(null); setSelectedSlot(""); }}>Cancel</button>
              <button className="primary" onClick={confirmBooking}>Confirm booking</button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-app-table-wrap">
        <table className="pt-app-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Concern</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.doctor}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.note || '—'}</td>
                <td><span className="badge">{a.status}</span></td>
                <td className="actions">
                  <button onClick={() => alert(`Reschedule ${a.id}`)}>Reschedule</button>
                  <button onClick={() => setAppointments(prev => prev.filter(x => x.id !== a.id))}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
