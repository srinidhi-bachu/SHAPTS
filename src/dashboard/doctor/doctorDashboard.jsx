 import React, { useMemo, useState } from "react";
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
   const [profile, setProfile] = useState({
     fullName: name ? `Dr. ${name}` : "Dr. John Doe",
     specialization: "Cardiologist",
     bio: "Experienced physician focused on patient-centered care.",
   });

   const [slots, setSlots] = useState([
     { day: "Mon", start: "10:00", end: "13:00" },
     { day: "Wed", start: "15:00", end: "18:00" },
   ]);

   const [appointments, setAppointments] = useState([
     { id: 1, patient: "A. Kumar", date: "2025-11-07", time: "10:30", status: "Confirmed" },
     { id: 2, patient: "R. Singh", date: "2025-11-07", time: "11:15", status: "Pending" },
   ]);

   const [prescriptionRows, setPrescriptionRows] = useState([
     { id: 1, medicine: "Atorvastatin 10mg", dosage: "1 tab", duration: "30 days", notes: "Night after food" },
   ]);

   const [uploads, setUploads] = useState([]); // {id, name, type}
   const [referral, setReferral] = useState({ to: "", notes: "" });

   const [history, setHistory] = useState([
     { id: 1, patient: "M. Rao", date: "2025-10-30", summary: "Routine checkup", feedback: "Helpful and clear" },
     { id: 2, patient: "J. Patel", date: "2025-10-22", summary: "Follow-up", feedback: "Great experience" },
   ]);

   const [consultation, setConsultation] = useState({
     currentPatient: "A. Kumar",
     reason: "Chest discomfort",
     notes: "",
     nextVisit: { date: "", time: "" },
   });

   const saveProfile = () => {
     try {
       localStorage.setItem("doctor_profile", JSON.stringify(profile));
       alert("Profile saved");
     } catch {}
   };

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
                  <button className={styles.btn} onClick={saveProfile}><FiCheckCircle /> Save Profile</button>
                </div>
               </div>
             )}

             {active === "availability" && (
               <div>
                 <div className={styles.formGrid}>
                   {slots.map((s, i) => (
                     <React.Fragment key={`${s.day}-${i}`}>
                       <div className={styles.col3}>
                         <label>Day</label>
                         <select className={styles.select} value={s.day} onChange={(e) => updateSlot(i, "day", e.target.value)}>
                           {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((d) => (
                             <option key={d} value={d}>{d}</option>
                           ))}
                         </select>
                       </div>
                       <div className={styles.col3}>
                         <label>Start</label>
                         <input type="time" className={styles.input} value={s.start} onChange={(e) => updateSlot(i, "start", e.target.value)} />
                       </div>
                       <div className={styles.col3}>
                         <label>End</label>
                         <input type="time" className={styles.input} value={s.end} onChange={(e) => updateSlot(i, "end", e.target.value)} />
                       </div>
                       <div className={styles.col3} style={{ display: "flex", alignItems: "end" }}>
                         <button className={`${styles.btn} ${styles.danger}`} onClick={() => removeSlot(i)}>Remove</button>
                       </div>
                     </React.Fragment>
                   ))}
                   <div className={styles.col12}>
                     <button className={styles.btn} onClick={addSlot}>Add Slot</button>
                   </div>
                 </div>
               </div>
             )}

             {active === "appointments" && (
               <div>
                 <table className={styles.table}>
                   <thead>
                     <tr>
                       <th>Patient</th>
                       <th>Date</th>
                       <th>Time</th>
                       <th>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {appointments.map((a) => (
                       <tr key={a.id}>
                         <td>{a.patient}</td>
                         <td>{a.date}</td>
                         <td>{a.time}</td>
                         <td>
                           <span className={`${styles.badge} ${a.status === "Confirmed" ? styles.success : styles.warn}`}>{a.status}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}

             {active === "prescriptions" && (
               <div className={styles.formGrid}>
                 {prescriptionRows.map((row) => (
                   <React.Fragment key={row.id}>
                     <div className={styles.col4}>
                       <label>Medicine</label>
                       <input className={styles.input} value={row.medicine} onChange={(e) => updateRxRow(row.id, "medicine", e.target.value)} />
                     </div>
                     <div className={styles.col3}>
                      <label>Dosage</label>
                      <input className={styles.input} value={row.dosage} onChange={(e) => updateRxRow(row.id, "dosage", e.target.value)} />
                    </div>
                    <div className={styles.col3}>
                      <label>Duration</label>
                      <input className={styles.input} value={row.duration} onChange={(e) => updateRxRow(row.id, "duration", e.target.value)} />
                    </div>
                     <div className={styles.col12}>
                       <label>Notes</label>
                       <input className={styles.input} value={row.notes} onChange={(e) => updateRxRow(row.id, "notes", e.target.value)} />
                     </div>
                   </React.Fragment>
                 ))}
                 <div className={styles.col12} style={{ display: "flex", gap: 8 }}>
                   <button className={styles.btn} onClick={addRxRow}>Add Row</button>
                   <button className={`${styles.btn} ${styles.success}`} onClick={savePrescription}><FiCheckCircle /> Save Prescription</button>
                 </div>
               </div>
             )}

             {active === "uploads" && (
               <div>
                 <div className={styles.formGrid}>
                   <div className={styles.col6}>
                     <label>Upload Reports</label>
                     <input className={styles.input} type="file" multiple onChange={onUpload} />
                   </div>
                   <div className={styles.col6}>
                     <label>Refer to Specialist</label>
                     <select className={styles.select} value={referral.to} onChange={(e) => setReferral({ ...referral, to: e.target.value })}>
                       <option value="">Select</option>
                       <option value="Cardiologist">Cardiologist</option>
                       <option value="Neurologist">Neurologist</option>
                       <option value="Orthopedic">Orthopedic</option>
                     </select>
                   </div>
                  <div className={styles.col12}>
                     <label>Referral Notes</label>
                     <textarea className={`${styles.input} ${styles.textarea}`} value={referral.notes} onChange={(e) => setReferral({ ...referral, notes: e.target.value })} />
                   </div>
                  <div className={styles.col12}>
                     <button className={styles.btn} onClick={saveReferral}>Save Referral</button>
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
                   <input className={styles.input} value={consultation.currentPatient} onChange={(e) => setConsultation({ ...consultation, currentPatient: e.target.value })} />
                 </div>
                 <div className={styles.col6}>
                   <label>Reason</label>
                   <input className={styles.input} value={consultation.reason} onChange={(e) => setConsultation({ ...consultation, reason: e.target.value })} />
                 </div>
                 <div className={styles.col12}>
                   <label>Consultation Notes</label>
                   <textarea className={`${styles.input} ${styles.textarea}`} value={consultation.notes} onChange={(e) => setConsultation({ ...consultation, notes: e.target.value })} />
                 </div>
                 <div className={styles.col3}>
                   <label>Next Visit - Date</label>
                   <input type="date" className={styles.input} value={consultation.nextVisit.date} onChange={(e) => setConsultation({ ...consultation, nextVisit: { ...consultation.nextVisit, date: e.target.value } })} />
                 </div>
                 <div className={styles.col3}>
                   <label>Next Visit - Time</label>
                   <input type="time" className={styles.input} value={consultation.nextVisit.time} onChange={(e) => setConsultation({ ...consultation, nextVisit: { ...consultation.nextVisit, time: e.target.value } })} />
                 </div>
                 <div className={styles.col12} style={{ display: "flex", gap: 8 }}>
                   <button className={`${styles.btn} ${styles.success}`} onClick={completeConsultation}>Mark Complete</button>
                   <button className={styles.btn} onClick={scheduleNext}>Schedule Next Visit</button>
                 </div>
               </div>
             )}
           </div>
         </section>
       </main>
     </div>
   );
 }
