import React from "react";
import { useParams, Link } from "react-router-dom";
import { getDoctorById } from "../data/doctors";
import "./DoctorProfile.css";

export default function DoctorProfile() {
  const { id } = useParams();
  const d = getDoctorById(id);

  if (!d) {
    return (
      <div className="doctor-profile">
        <h2>Doctor not found</h2>
        <p>We couldn't find a profile for this doctor.</p>
        <Link to="/patient-dashboard/book" className="btn-link">Back to booking</Link>
      </div>
    );
  }

  const lastInitial = d.name.split(' ').slice(-1)[0][0];
  const prev = d.prev || [];
  const services = d.services || [];
  const gallery = d.gallery || [];
  const contact = d.contact || {};
  const title = d.title || `${d.spec}`;
  const cover = d.cover || '';

  return (
    <div className="doctor-profile">
      {/* Hero Section */}
      <section className="dp-hero" style={cover ? { backgroundImage: `url(${cover})` } : undefined}>
        <div className="dp-overlay" />
        <div className="dp-hero-inner">
          <div className="avatar">
            {d.photo ? (
              <img src={d.photo} alt={d.name} />
            ) : (
              <div className="avatar-fallback" aria-label={d.name}>{lastInitial}</div>
            )}
          </div>
          <h1>{d.name}</h1>
          <p className="title">{title}</p>
          <div className="dp-hero-cta">
            <button className="btn primary" onClick={() => { window.location.href = `/patient-dashboard/book?doctor=${encodeURIComponent(d.id)}`; }}>Book Appointment</button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="card">
        <h2>About Me</h2>
        <p>{d.bio}</p>
        <div className="chips">
          <span className="chip">{d.hospital}</span>
          <span className="chip">{d.city}</span>
          <span className="chip">⭐ {d.rating}</span>
          <span className="chip">₹ {d.fee} consultation</span>
          {d.lang?.length ? <span className="chip">Languages: {d.lang.join(', ')}</span> : null}
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="card">
          <h2>Services</h2>
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="card">
          <h2>Gallery</h2>
          <div className="gallery-grid">
            {gallery.map((src, i) => (
              <div key={i} className="gallery-item">
                <img src={src} alt={`Gallery ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      <section className="card">
        <h2>Previous Experience</h2>
        {prev.length ? (
          <ul className="list">
            {prev.map((p, idx) => (
              <li key={idx}>
                <strong>{p.role || 'Consultant'}</strong> at {p.place} ({p.years || '—'})
              </li>
            ))}
          </ul>
        ) : (
          <p>—</p>
        )}
      </section>

      {/* Details */}
      <section className="card">
        <h2>Specialization & Details</h2>
        <ul className="list">
          <li><strong>Specialization:</strong> {d.spec}</li>
          <li><strong>Experience:</strong> {d.exp} years</li>
          <li><strong>Current Hospital:</strong> {d.hospital}</li>
          <li><strong>City:</strong> {d.city}</li>
        </ul>
      </section>

      {/* Contact */}
      {(contact.address || contact.phone || contact.email || contact.timings) && (
        <section className="card">
          <h2>Contact</h2>
          {contact.address && <p><strong>Address:</strong> {contact.address}</p>}
          {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
          {contact.email && <p><strong>Email:</strong> {contact.email}</p>}
          {contact.timings && <p><strong>Timings:</strong> {contact.timings}</p>}
          {contact.email && (
            <div className="actions">
              <a className="btn primary" href={`mailto:${contact.email}`}>Send Email</a>
            </div>
          )}
        </section>
      )}

      <div className="actions">
        <Link to="/patient-dashboard/book" className="btn secondary">Back</Link>
      </div>
    </div>
  );
}
