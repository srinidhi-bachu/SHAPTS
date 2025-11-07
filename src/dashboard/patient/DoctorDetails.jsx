import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DIRECTORY } from "./data";
import "./PrescriptionsTab.css";
import AmbulanceButton from "../../components/AmbulanceButton.jsx";
import "./DoctorPortfolio.css";

function findDoctorById(id){
  for(const loc of DIRECTORY.locations){
    for(const hosp of loc.hospitals){
      const found = hosp.doctors.find(d=>d.id===id);
      if(found) return { doctor: found, hospital: hosp, location: loc.name };
    }
  }
  return null;
}

export default function DoctorDetails(){
  const { id } = useParams();
  const nav = useNavigate();
  const info = useMemo(()=>findDoctorById(id), [id]);
  const [tab, setTab] = useState("overview");

  if(!info){
    return (
      <div className="u-card" style={{ padding: 16 }}>
        <div style={{ marginBottom: 8 }}>Doctor not found.</div>
        <button className="u-btn" onClick={()=>nav(-1)}>Go Back</button>
      </div>
    );
  }

  const { doctor, hospital, location } = info;

  return (
    <div className="dp-page slide-up">
      <div className="dp-hero">
        <div className="dp-hero-inner">
          <button className="u-btn" onClick={()=>nav(-1)}>← Back</button>
          <div className="dp-hero-info">
            <img src={doctor.photo} alt={doctor.name} width={96} height={96} className="dp-avatar" />
            <div>
              <div className="dp-name">{doctor.name}</div>
              <div className="dp-sub">{doctor.specialization} • {location} • {hospital.name}</div>
              <div className="dp-stats">
                {typeof doctor.rating === 'number' && <span className="dp-stat">⭐ {doctor.rating}</span>}
                <span className="dp-stat">{doctor.experience}+ yrs exp</span>
                {typeof doctor.fee === 'number' && <span className="dp-stat">₹ {doctor.fee}</span>}
              </div>
            </div>
          </div>
          <div className="dp-hero-actions">
            <button className="u-btn" onClick={()=>nav('/patient-dashboard/hospital/'+hospital.id)}>View Hospital</button>
            <AmbulanceButton labelDefault="Book" labelSuccess="Booked" onComplete={()=>nav('/patient-dashboard/book')} />
          </div>
        </div>
      </div>

      <div className="dp-wrap">
        <aside className="dp-sidebar">
          <div className="u-card" style={{ padding: 14 }}>
            <div className="muted" style={{ marginBottom: 6 }}>Languages</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
              {(doctor.languages||[]).map(l => <span key={l} className="u-badge">{l}</span>)}
            </div>
            <div className="muted" style={{ margin: '12px 0 6px' }}>Availability</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
              {(doctor.availability||[]).map((t,i)=> <span key={i} className="u-badge">{t}</span>)}
            </div>
          </div>
          <div className="u-card" style={{ padding: 14, marginTop: 12 }}>
            <div className="muted" style={{ marginBottom: 6 }}>Contact</div>
            <div style={{ color:'var(--text)' }}>{hospital.name}</div>
            <div className="muted">{location}</div>
            <button className="u-btn" style={{ marginTop: 10 }} onClick={()=>nav('/patient-dashboard/locations/'+encodeURIComponent(location))}>Other hospitals</button>
          </div>
        </aside>

        <main className="dp-main">
          <div className="dp-tabs">
            <button className={`dp-tab ${tab==='overview'?'on':''}`} onClick={()=>setTab('overview')}>Overview</button>
            <button className={`dp-tab ${tab==='exp'?'on':''}`} onClick={()=>setTab('exp')}>Experience & Education</button>
            <button className={`dp-tab ${tab==='services'?'on':''}`} onClick={()=>setTab('services')}>Services & Fees</button>
            <button className={`dp-tab ${tab==='reviews'?'on':''}`} onClick={()=>setTab('reviews')}>Reviews</button>
            <button className={`dp-tab ${tab==='contact'?'on':''}`} onClick={()=>setTab('contact')}>Contact</button>
          </div>

          {tab==='overview' && (
            <section className="u-card" style={{ padding: 16 }}>
              {doctor.bio && <p style={{ marginTop: 0 }}>{doctor.bio}</p>}
              {doctor.qualifications?.length ? (
                <div style={{ marginTop: 10 }}>
                  <div className="muted">Qualifications</div>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: 18 }}>{doctor.qualifications.map((q,i)=>(<li key={i}>{q}</li>))}</ul>
                </div>
              ) : null}
            </section>
          )}

          {tab==='exp' && (
            <section className="u-card" style={{ padding: 16 }}>
              <div className="muted">Experience</div>
              <p style={{ marginTop: 6 }}>{doctor.experience}+ years in practice across {doctor.specialization}.</p>
              {doctor.education?.length ? (
                <div style={{ marginTop: 10 }}>
                  <div className="muted">Education</div>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: 18 }}>{doctor.education.map((e,i)=>(<li key={i}>{e}</li>))}</ul>
                </div>
              ) : null}
              {doctor.achievements?.length ? (
                <div style={{ marginTop: 10 }}>
                  <div className="muted">Achievements</div>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: 18 }}>{doctor.achievements.map((a,i)=>(<li key={i}>{a}</li>))}</ul>
                </div>
              ) : null}
            </section>
          )}

          {tab==='services' && (
            <section className="u-card" style={{ padding: 16 }}>
              {doctor.services?.length ? (
                <div>
                  <div className="muted">Services</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap: 8, marginTop: 8 }}>
                    {doctor.services.map((s,i)=>(<span key={i} className="u-badge">{s}</span>))}
                  </div>
                </div>
              ) : <div className="muted">No services listed.</div>}
              {typeof doctor.fee === 'number' && (
                <div style={{ marginTop: 12 }}>
                  <div className="muted">Consultation Fee</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>₹ {doctor.fee}</div>
                </div>
              )}
            </section>
          )}

          {tab==='reviews' && (
            <section className="u-card" style={{ padding: 16 }}>
              <div className="muted">Patient Reviews</div>
              <div className="dp-review">
                <div className="dp-review-h">★★★★★ <span className="muted">— R. Singh</span></div>
                <p>Very patient and thorough. Helped me understand my treatment plan clearly.</p>
              </div>
              <div className="dp-review">
                <div className="dp-review-h">★★★★☆ <span className="muted">— A. Kumar</span></div>
                <p>Great experience. Minimal wait time and effective medication.</p>
              </div>
            </section>
          )}

          {tab==='contact' && (
            <section className="u-card" style={{ padding: 16 }}>
              <div className="muted">Hospital</div>
              <div style={{ fontWeight: 700 }}>{hospital.name}</div>
              <div className="muted">{location}</div>
              <button className="u-btn" style={{ marginTop: 10 }} onClick={()=>nav('/patient-dashboard/hospital/'+hospital.id)}>View all doctors at this hospital</button>
            </section>
          )}
        </main>
      </div>

      <div className="dp-cta">
        <div className="dp-cta-inner">
          <div>
            <div className="muted">Next available</div>
            <div style={{ fontWeight: 700 }}>{(doctor.availability&&doctor.availability[0]) || 'Mon-Fri 10:00-13:00'}</div>
          </div>
          <AmbulanceButton labelDefault="Book" labelSuccess="Booked" onComplete={()=>nav('/patient-dashboard/book')} />
        </div>
      </div>
    </div>
  );
}
