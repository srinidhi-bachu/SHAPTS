    import React, { useEffect, useMemo, useState } from "react";
import {
  FiUser,
  FiClock,
  FiCalendar,
  FiFileText,
  FiUpload,
  FiBookOpen,
  FiCheckCircle,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import styles from "./DoctorDashboard.module.css";
import { save, load } from "../../services/storage";
import { findSlotConflicts } from "../../services/validators";
import { generatePrescriptionPDF } from "../../services/pdf";

export default function DoctorDashboard() {
  const storedName = typeof window !== "undefined" ? localStorage.getItem("userName") : null;
  const name = storedName || "John Doe";
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : "Doctor";

  const TABS = useMemo(
    () => [
      { id: "profile", label: "Profile", icon: <FiUser /> },
      { id: "availability", label: "Availability", icon: <FiClock /> },
      { id: "appointments", label: "Appointments", icon: <FiCalendar /> },
      { id: "prescriptions", label: "Prescriptions", icon: <FiFileText /> },
      { id: "uploads", label: "Uploads/Referrals", icon: <FiUpload /> },
      { id: "history", label: "Visit History", icon: <FiBookOpen /> },
      { id: "consultation", label: "Consultation", icon: <FiCheckCircle /> },
    ],
    []
  );

  const [active, setActive] = useState("profile");

  // Local state stores
  const [profile, setProfile] = useState(() => load("doc:profile", {
    fullName: name ? `Dr. ${name}` : "Dr. John Doe",
    specialization: "Cardiologist",
    bio: "Experienced physician focused on patient-centered care.",
  }));

  const [slots, setSlots] = useState(() => load("doc:slots", [
    { day: "Mon", start: "10:00", end: "13:00" },
    { day: "Wed", start: "15:00", end: "18:00" },
  ]));

  const [appointments, setAppointments] = useState(() => load("doc:appointments", [
    { id: 1, patient: "A. Kumar", date: "2025-11-07", time: "10:30", status: "Confirmed" },
    { id: 2, patient: "R. Singh", date: "2025-11-07", time: "11:15", status: "Pending" },
  ]));

  const [prescriptionRows, setPrescriptionRows] = useState(() => load("doc:rxrows", [
    { id: 1, medicine: "Atorvastatin 10mg", dosage: "1 tab", duration: "30 days", notes: "Night after food" },
  ]));

  const [uploads, setUploads] = useState(() => load("doc:uploads", [])); // {id, name, type}
  const [referral, setReferral] = useState(() => load("doc:referral", { to: "", notes: "" }));

  const [history, setHistory] = useState(() => load("doc:history", [
    { id: 1, patient: "M. Rao", date: "2025-10-30", summary: "Routine checkup", feedback: "Helpful and clear" },
    { id: 2, patient: "J. Patel", date: "2025-10-22", summary: "Follow-up", feedback: "Great experience" },
  ]));

  const [consultation, setConsultation] = useState(() => load("doc:consult", {
    currentPatient: "A. Kumar",
    reason: "Chest discomfort",
    notes: "",
    nextVisit: { date: "", time: "" },
  }));

  // AI Rx assistant UI state (mock)
  const [rxAssistOpen, setRxAssistOpen] = useState(false);
  const [rxSuggestions, setRxSuggestions] = useState([]);

  // Auto-save on change
  useEffect(() => { save("doc:profile", profile); }, [profile]);
  useEffect(() => { save("doc:slots", slots); }, [slots]);
  useEffect(() => { save("doc:appointments", appointments); }, [appointments]);
  useEffect(() => { save("doc:rxrows", prescriptionRows); }, [prescriptionRows]);
  useEffect(() => { save("doc:uploads", uploads); }, [uploads]);
  useEffect(() => { save("doc:referral", referral); }, [referral]);
  useEffect(() => { save("doc:history", history); }, [history]);
  useEffect(() => { save("doc:consult", consultation); }, [consultation]);

  const saveProfile = () => {
    try {
      localStorage.setItem("doctor_profile", JSON.stringify(profile));
      alert("Profile saved");
    } catch {}
  };

  // AI Rx assistant (mock suggestions based on reason keywords)
  const openRxAssistant = () => {
    const reason = (consultation.reason || "").toLowerCase();
    const pool = [];
    if (/chest|bp|cardiac|pressure/.test(reason)) {
      pool.push(
        { medicine: "Atorvastatin 10mg", dosage: "1 tab", duration: "30 days", notes: "Night" },
        { medicine: "Aspirin 75mg", dosage: "1 tab", duration: "30 days", notes: "After breakfast" }
      );
    }
    if (/cough|cold|fever/.test(reason)) {
      pool.push(
        { medicine: "Paracetamol 500mg", dosage: "1 tab", duration: "5 days", notes: "SOS fever" },
        { medicine: "Levocetirizine 5mg", dosage: "1 tab", duration: "5 days", notes: "Night" }
      );
    }
    if (/skin|rash|acne|eczema/.test(reason)) {
      pool.push(
        { medicine: "Clindamycin Gel", dosage: "Topical", duration: "14 days", notes: "Night" },
        { medicine: "Doxycycline 100mg", dosage: "1 cap", duration: "7 days", notes: "After food" }
      );
    }
    const uniq = [];
    const seen = new Set();
    pool.forEach((s) => { const k = `${s.medicine}|${s.dosage}`; if (!seen.has(k)) { seen.add(k); uniq.push(s); } });
    setRxSuggestions(uniq.length ? uniq : [{ medicine: "ORS", dosage: "200ml", duration: "2 days", notes: "Hydration" }]);
    setRxAssistOpen(true);
  };

  const addSuggestionToRx = (s) => {
    setPrescriptionRows((r) => [
      ...r,
      { id: (r[r.length - 1]?.id || 0) + 1, medicine: s.medicine, dosage: s.dosage, duration: s.duration, notes: s.notes },
    ]);
  };

  // Queue tracker state (session-only)
  const [queueIndex, setQueueIndex] = useState(0);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysQueue = useMemo(() => {
    const list = appointments
      .filter((a) => a.date === todayStr && ["Pending", "Confirmed"].includes(a.status))
      .sort((x, y) => x.time.localeCompare(y.time));
    return list;
  }, [appointments]);
  const currentServing = todaysQueue[queueIndex] || null;
  const advanceQueue = () => {
    setQueueIndex((i) => {
      const next = Math.min(i + 1, Math.max(0, todaysQueue.length - 1));
      return next;
    });
  };

  // Widgets data
  const todaysAppointments = useMemo(() => {
    return appointments.filter((a) => a.date === todayStr);
  }, [appointments]);
  const nextAppt = useMemo(() => {
    const sorted = todaysAppointments.slice().sort((x, y) => x.time.localeCompare(y.time));
    return sorted[0] || null;
  }, [todaysAppointments]);
  const pendingFollowUps = useMemo(() => {
    return history.filter((h) => !h.feedback || h.feedback === "").length;
  }, [history]);

  // Weekly consultations data (last 7 days) from appointments
  const weeklySeries = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = appointments.filter((a) => a.date === key).length;
      days.push({ key, label: d.toLocaleDateString(undefined, { weekday: 'short' }), value: count });
    }
    return days;
  }, [appointments]);

  const weeklyPolyline = useMemo(() => {
    const w = 260, h = 60, pad = 6;
    const max = Math.max(1, ...weeklySeries.map((p) => p.value));
    if (!weeklySeries.length) return "";
    const stepX = (w - pad * 2) / (weeklySeries.length - 1 || 1);
    const points = weeklySeries.map((p, i) => {
      const x = pad + i * stepX;
      const y = h - pad - (p.value / max) * (h - pad * 2);
      return `${x},${y}`;
    }).join(' ');
    return { w, h, pad, points, max };
  }, [weeklySeries]);

  const addSlot = () => setSlots((s) => [...s, { day: "", start: "09:00", end: "10:00" }]);
  const updateSlot = (i, k, v) => setSlots((s) => s.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));
  const removeSlot = (i) => setSlots((s) => s.filter((_, idx) => idx !== i));

  const addRxRow = () =>
    setPrescriptionRows((r) => [
      ...r,
      { id: (r[r.length - 1]?.id || 0) + 1, medicine: "", dosage: "", duration: "", notes: "" },
    ]);
  const updateRxRow = (id, k, v) => setPrescriptionRows((r) => r.map((row) => (row.id === id ? { ...row, [k]: v } : row)));
  const removeRxRow = (id) => setPrescriptionRows((r) => r.filter((row) => row.id !== id));
  const savePrescription = () => alert("Prescription saved");

  // Appointments helpers
  const addAppointment = () =>
    setAppointments((a) => [
      ...a,
      {
        id: (a[a.length - 1]?.id || 0) + 1,
        patient: "",
        date: new Date().toISOString().slice(0, 10),
        time: "10:00",
        status: "Pending",
      },
    ]);
  const updateAppointment = (id, k, v) => setAppointments((a) => a.map((row) => (row.id === id ? { ...row, [k]: v } : row)));
  const removeAppointment = (id) => setAppointments((a) => a.filter((row) => row.id !== id));
  const findAppointmentConflicts = (arr) => {
    const byDate = arr.reduce((acc, it) => {
      acc[it.date] = acc[it.date] || [];
      acc[it.date].push(it);
      return acc;
    }, {});
    const conflicts = [];
    Object.keys(byDate).forEach((d) => {
      const list = byDate[d];
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (list[i].time === list[j].time) {
            conflicts.push({ date: d, a: list[i], b: list[j] });
          }
        }
      }
    });
    return conflicts;
  };

  const exportPrescriptionPDF = async () => {
    const res = await generatePrescriptionPDF({
      doctor: { fullName: profile.fullName, specialization: profile.specialization },
      patient: consultation.currentPatient || "Patient",
      rows: prescriptionRows,
      meta: { clinic: "SHAPTS Clinic" },
    });
    if (!res.ok) {
      if (res.reason === 'missing_deps') {
        alert("PDF export requires dependencies (jspdf, qrcode). I will propose an install command.");
      } else {
        alert("Failed to generate PDF. Please try again.");
      }
    }
  };

  const onUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploads((u) => [
      ...u,
      ...files.map((f, idx) => ({ id: u.length + idx + 1, name: f.name, type: f.type || "file" })),
    ]);
  };

  const saveReferral = () => alert("Referral saved");

  const completeConsultation = () => {
    setHistory((h) => [
      { id: (h[0]?.id || 0) + 1, patient: consultation.currentPatient, date: new Date().toISOString().slice(0, 10), summary: consultation.reason, feedback: "-" },
      ...h,
    ]);
    alert("Consultation marked complete");
  };

  const scheduleNext = () => alert("Next visit scheduled");

  return (
    <div className={styles.container}>
      <aside className={styles.sidenav}>
        <div className={styles.brand}>
          <div className={styles.avatar} />
          <div>
            <div className={styles.brandTitle}>Dr. Portal</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Empowering care</div>
          </div>
        </div>

        <div className={styles.navSectionTitle}>Workspace</div>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.navButton} ${active === t.id ? styles.navButtonActive : ""}`}
            onClick={() => setActive(t.id)}
            aria-pressed={active === t.id}
          >
            <span style={{ display: "grid", placeItems: "center", width: 20 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}

        <button
          className={`${styles.navButton} ${styles.logout}`}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      <header className={styles.topbar}>
        <div className={styles.search}>
          <FiSearch />
          <input placeholder="Search patients, appointments, prescriptions..." />
        </div>
        <div className={styles.userBadge}>
          <div className={styles.avatar} />
          <div>
            <div style={{ fontWeight: 600 }}>{profile.fullName}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{role}</div>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        {/* KPI cards */}
        <section className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Today Appointments</div>
            <div className={styles.cardValue}>{appointments.length}</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Pending Prescriptions</div>
            <div className={styles.cardValue}>{Math.max(0, prescriptionRows.length - 1)}</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>New Uploads</div>
            <div className={styles.cardValue}>{uploads.length}</div>
          </div>
        </section>

        {/* Panel with tabs */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.tabs}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.tabBtn} ${active === t.id ? styles.tabBtnActive : ""}`}
                  onClick={() => setActive(t.id)}
                >
                  <span style={{ verticalAlign: "middle", marginRight: 6 }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tabContent}>
            {active === "profile" && (
              <div className={styles.formGrid}>
                <div className={styles.col6}>
                  <label>Full Name</label>
                  <input
                    className={styles.input}
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className={styles.col6}>
                  <label>Specialization</label>
                  <input
                    className={styles.input}
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  />
                </div>
                <div className={styles.col12}>
                  <label>Bio</label>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
                <div className={styles.col12}>
                  <button className={styles.btn} onClick={saveProfile}>
                    <FiCheckCircle /> Save Profile
                  </button>
                </div>
              </div>
            )}

            {active === "appointments" && (
              <div>
                {/* Widgets row */}
                <div className={styles.cards} style={{ marginBottom: 8 }}>
                  <div className={styles.card}>
                    <div className={styles.cardTitle}>Today’s Appointments</div>
                    <div className={styles.cardValue}>{todaysAppointments.length}</div>
                    <div className={styles.muted}>
                      {nextAppt ? `Next: ${nextAppt.patient || 'Patient'} at ${nextAppt.time}` : 'No upcoming today'}
                    </div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardTitle}>Pending Follow-ups</div>
                    <div className={styles.cardValue}>{pendingFollowUps}</div>
                    <div className={styles.muted}>Patients awaiting follow-up notes</div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardTitle}>Virtual Consultation</div>
                    <button className={styles.btn} onClick={() => alert('Starting virtual appointment (stub)')}>Start</button>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.cardTitle}>Weekly Consultations</div>
                    <svg className={styles.chart} viewBox={`0 0 ${weeklyPolyline.w} ${weeklyPolyline.h}`} aria-label="weekly consultations">
                      <polyline fill="none" stroke="#2563eb" strokeWidth="2" points={weeklyPolyline.points} />
                      {weeklySeries.map((p, i) => (
                        <circle key={i} cx={6 + i * ((weeklyPolyline.w - 12) / (weeklySeries.length - 1 || 1))} cy={weeklyPolyline.h - 6 - (p.value / Math.max(1, weeklyPolyline.max)) * (weeklyPolyline.h - 12)} r="2" fill="#2563eb" />
                      ))}
                    </svg>
                    <div className={styles.muted}>{weeklySeries.map(d => d.label).join(' · ')}</div>
                  </div>
                </div>

                {/* Quick Access */}
                <div className={styles.quickBar}>
                  <button className={styles.btn} onClick={() => alert('Translate (stub)')}>Translate</button>
                  <button className={styles.btn} onClick={() => setReferral({ ...referral, to: referral.to || '' })}>Refer</button>
                  <button className={styles.btn} onClick={() => alert('Call patient (stub)')}>Call</button>
                  <button className={styles.btn} onClick={() => alert('Notify patient (stub)')}>Notify</button>
                </div>
                {(() => {
                  const conf = findAppointmentConflicts(appointments);
                  if (!conf.length) return null;
                  return (
                    <div className={styles.card} style={{ borderColor: "#f87171", background: "rgba(248,113,113,0.08)", marginBottom: 12 }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>Appointment conflicts detected</div>
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {conf.map((c, i) => (
                          <li key={i}>
                            {c.date} at {c.a.time}: {c.a.patient || "(unnamed)"} ↔ {c.b.patient || "(unnamed)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}

                {/* Live Queue Tracker */}
                <div className={styles.queueCard}>
                  <div className={styles.queueHeader}>Live Queue</div>
                  <div className={styles.queueBody}>
                    <div className={styles.queueStat}><span>Now Serving</span><strong>{currentServing ? `${currentServing.patient || 'Patient'} (${currentServing.time})` : '—'}</strong></div>
                    <div className={styles.queueStat}><span>Waiting</span><strong>{Math.max(0, todaysQueue.length - (currentServing ? 1 : 0) - queueIndex)}</strong></div>
                    <div className={styles.queueActions}>
                      <button className={styles.btn} onClick={advanceQueue}>Next Patient</button>
                    </div>
                  </div>
                </div>

                {/* Timeline view */}
                <div className={styles.timeline}>
                  {Object.entries(
                    appointments.reduce((acc, a) => {
                      (acc[a.date] = acc[a.date] || []).push(a);
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([date, list]) => (
                      <div key={date} className={styles.timelineGroup}>
                        <div className={styles.timelineDate}>{date}</div>
                        <div className={styles.timelineItems}>
                          {list
                            .slice()
                            .sort((x, y) => x.time.localeCompare(y.time))
                            .map((a) => (
                              <div key={a.id} className={styles.timelineItem}>
                                <div className={styles.timelineMeta}>
                                  <div className={styles.timelineTime}>{a.time}</div>
                                  <div className={styles.timelinePatient}>{a.patient || '(unnamed)'}</div>
                                </div>
                                <div className={styles.timelineControls}>
                                  <select
                                    className={styles.select}
                                    value={a.status}
                                    onChange={(e) => updateAppointment(a.id, 'status', e.target.value)}
                                  >
                                    <option>Pending</option>
                                    <option>Confirmed</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>

                <div className={styles.formGrid}>
                  {appointments.map((a) => (
                    <React.Fragment key={a.id}>
                      <div className={styles.col4}>
                        <label>Patient</label>
                        <input
                          className={styles.input}
                          value={a.patient}
                          onChange={(e) => updateAppointment(a.id, "patient", e.target.value)}
                        />
                      </div>
                      <div className={styles.col3}>
                        <label>Date</label>
                        <input
                          type="date"
                          className={styles.input}
                          value={a.date}
                          onChange={(e) => updateAppointment(a.id, "date", e.target.value)}
                        />
                      </div>
                      <div className={styles.col3}>
                        <label>Time</label>
                        <input
                          type="time"
                          className={styles.input}
                          value={a.time}
                          onChange={(e) => updateAppointment(a.id, "time", e.target.value)}
                        />
                      </div>
                      <div className={styles.col2}>
                        <label>Status</label>
                        <select
                          className={styles.select}
                          value={a.status}
                          onChange={(e) => updateAppointment(a.id, "status", e.target.value)}
                        >
                          <option>Pending</option>
                          <option>Confirmed</option>
                          <option>Completed</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                      <div className={styles.col12}>
                        <button className={`${styles.btn} ${styles.danger}`} onClick={() => removeAppointment(a.id)}>Remove</button>
                      </div>
                    </React.Fragment>
                  ))}
                  <div className={styles.col12}>
                    <button className={styles.btn} onClick={addAppointment}>Add Appointment</button>
                  </div>
                </div>
              </div>
            )}

            {active === "availability" && (
              <div>
                {/* Conflict warnings */}
                {(() => {
                  const conf = findSlotConflicts(slots);
                  if (!conf.length) return null;
                  return (
                    <div className={styles.card} style={{ borderColor: "#fbbf24", background: "rgba(251,191,36,0.08)" }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>Conflicting slots detected</div>
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {conf.map((c, i) => (
                          <li key={i}>{c.day}: {c.a.start}-{c.a.end} overlaps {c.b.start}-{c.b.end}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
                <div className={styles.formGrid}>
                  {slots.map((s, i) => (
                    <React.Fragment key={`${s.day}-${i}`}>
                      <div className={styles.col3}>
                        <label>Day</label>
                        <select
                          className={styles.select}
                          value={s.day}
                          onChange={(e) => updateSlot(i, "day", e.target.value)}
                        >
                          {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.col3}>
                        <label>Start</label>
                        <input
                          type="time"
                          className={styles.input}
                          value={s.start}
                          onChange={(e) => updateSlot(i, "start", e.target.value)}
                        />
                      </div>
                      <div className={styles.col3}>
                        <label>End</label>
                        <input
                          type="time"
                          className={styles.input}
                          value={s.end}
                          onChange={(e) => updateSlot(i, "end", e.target.value)}
                        />
                      </div>
                      <div className={styles.col3} style={{ display: "flex", alignItems: "end" }}>
                        <button className={`${styles.btn} ${styles.danger}`} onClick={() => removeSlot(i)}>
                          Remove
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
                  <div className={styles.col12}>
                    <button className={styles.btn} onClick={addSlot}>Add Slot</button>
                  </div>
                </div>
              </div>
            )}

            {active === "prescriptions" && (
              <div className={styles.formGrid}>
                {prescriptionRows.map((row) => (
                  <React.Fragment key={row.id}>
                    <div className={styles.col4}>
                      <label>Medicine</label>
                      <input
                        className={styles.input}
                        value={row.medicine}
                        onChange={(e) => updateRxRow(row.id, "medicine", e.target.value)}
                      />
                    </div>
                    <div className={styles.col3}>
                      <label>Dosage</label>
                      <input
                        className={styles.input}
                        value={row.dosage}
                        onChange={(e) => updateRxRow(row.id, "dosage", e.target.value)}
                      />
                    </div>
                    <div className={styles.col3}>
                      <label>Duration</label>
                      <input
                        className={styles.input}
                        value={row.duration}
                        onChange={(e) => updateRxRow(row.id, "duration", e.target.value)}
                      />
                    </div>
                    <div className={styles.col12}>
                      <label>Notes</label>
                      <input
                        className={styles.input}
                        value={row.notes}
                        onChange={(e) => updateRxRow(row.id, "notes", e.target.value)}
                      />
                    </div>
                  </React.Fragment>
                ))}
                <div className={styles.col12} style={{ display: "flex", gap: 8 }}>
                  <button className={styles.btn} onClick={addRxRow}>
                    Add Row
                  </button>
                  <button
                    className={`${styles.btn} ${styles.success}`}
                    onClick={savePrescription}
                  >
                    <FiCheckCircle /> Save Prescription
                  </button>
                  <button className={styles.btn} onClick={exportPrescriptionPDF}>
                    Export PDF
                  </button>
                </div>
              </div>
            )}

            {active === "uploads" && (
              <div>
                <div className={styles.formGrid}>
                  <div className={styles.col6}>
                    <label>Upload Reports</label>
                    <input
                      className={styles.input}
                      type="file"
                      multiple
                      onChange={onUpload}
                    />
                  </div>
                  <div className={styles.col6}>
                    <label>Refer to Specialist</label>
                    <select
                      className={styles.select}
                      value={referral.to}
                      onChange={(e) => setReferral({ ...referral, to: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Orthopedic">Orthopedic</option>
                    </select>
                  </div>
                  <div className={styles.col12}>
                    <label>Referral Notes</label>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      value={referral.notes}
                      onChange={(e) => setReferral({ ...referral, notes: e.target.value })}
                    />
                  </div>
                  <div className={styles.col12}>
                    <button className={styles.btn} onClick={saveReferral}>
                      Save Referral
                    </button>
                  </div>
                </div>
                <div className={styles.separator} />
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {active === "history" && (
              <div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Summary</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id}>
                        <td>{h.patient}</td>
                        <td>{h.date}</td>
                        <td>{h.summary}</td>
                        <td>{h.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {active === "consultation" && (
              <div className={styles.formGrid}>
                <div className={styles.col6}>
                  <label>Current Patient</label>
                  <input
                    className={styles.input}
                    value={consultation.currentPatient}
                    onChange={(e) => setConsultation({ ...consultation, currentPatient: e.target.value })}
                  />
                </div>
                <div className={styles.col6}>
                  <label>Reason</label>
                  <input
                    className={styles.input}
                    value={consultation.reason}
                    onChange={(e) => setConsultation({ ...consultation, reason: e.target.value })}
                  />
                </div>
                <div className={styles.col12}>
                  <label>Consultation Notes</label>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    value={consultation.notes}
                    onChange={(e) => setConsultation({ ...consultation, notes: e.target.value })}
                  />
                </div>
                <div className={styles.col3}>
                  <label>Next Visit - Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={consultation.nextVisit.date}
                    onChange={(e) =>
                      setConsultation({ ...consultation, nextVisit: { ...consultation.nextVisit, date: e.target.value } })
                    }
                  />
                </div>
                <div className={styles.col3}>
                  <label>Next Visit - Time</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={consultation.nextVisit.time}
                    onChange={(e) =>
                      setConsultation({ ...consultation, nextVisit: { ...consultation.nextVisit, time: e.target.value } })
                    }
                  />
                </div>
                <div className={styles.col12} style={{ display: "flex", gap: 8 }}>
                  <button
                    className={`${styles.btn} ${styles.success}`}
                    onClick={completeConsultation}
                  >
                    Mark Complete
                  </button>
                  <button className={styles.btn} onClick={scheduleNext}>
                    Schedule Next Visit
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
