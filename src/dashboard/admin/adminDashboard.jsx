 import React, { useMemo, useState } from "react";
 import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const name = localStorage.getItem("userName") || "Admin";
  const role = (localStorage.getItem("role") || "admin").toUpperCase();

  const TABS = useMemo(
    () => [
      "Analytics",
      "Doctors",
      "Schedules",
      "Patients",
      "Inventory",
      "Reports",
      "Announcements",
      "Security",
    ],
    []
  );

  const [tab, setTab] = useState("Analytics");
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Sharma", specialization: "Cardiology", status: "Active" },
    { id: 2, name: "Dr. Rao", specialization: "Neurology", status: "Inactive" },
  ]);
  const [patients, setPatients] = useState([
    { id: 1, name: "R. Singh", age: 34, visits: 5, lastVisit: "2025-10-30" },
    { id: 2, name: "A. Kumar", age: 41, visits: 2, lastVisit: "2025-10-29" },
  ]);
  const [inventory, setInventory] = useState([
    { id: 1, item: "Atorvastatin 10mg", type: "Medicine", stock: 120, status: "OK" },
    { id: 2, item: "X-Ray Film", type: "Diagnostics", stock: 8, status: "Low" },
  ]);
  const [slots, setSlots] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [metrics, setMetrics] = useState([
    { title: "Today Appointments", value: 42 },
    { title: "Cancellations", value: 5 },
    { title: "Active Doctors", value: 18 },
    { title: "Patients Today", value: 97 },
  ]);

  const [formDoctor, setFormDoctor] = useState({ id: null, name: "", specialization: "", status: "Active" });
  const [formPatient, setFormPatient] = useState({ id: null, name: "", age: "", visits: "", lastVisit: "" });
  const [formInv, setFormInv] = useState({ id: null, item: "", type: "Medicine", stock: "", status: "OK" });
  const [formSlot, setFormSlot] = useState({ doctor: "Dr. Sharma", date: "", start: "", end: "" });
  const [annForm, setAnnForm] = useState({ audience: "All Patients", message: "" });

  const nextId = (list) => (list[list.length - 1]?.id || 0) + 1;
  const downloadCSV = (rows, headers, filename) => {
    const csv = [headers.join(",")].concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };
  const parseCSV = (text) => text.split(/\r?\n/).filter(Boolean).map(l => l.split(",").map(s => s.replace(/^\"|\"$/g, "")));

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

   return (
     <div className={styles.wrap}>
       <header className={styles.top}>
         <div className={styles.brand}>
           <div className={styles.logo}>AD</div>
           <div>
             <div style={{ fontWeight: 700 }}>Admin Console</div>
             <small style={{ color: "#6b7a90" }}>Clinic Management</small>
           </div>
         </div>
         <div className={styles.user}>
           <span style={{ fontSize: 12, background: "#e9f1ff", border: "1px solid #cfe1ff", padding: "4px 8px", borderRadius: 999 }}>{role}</span>
           <span style={{ fontWeight: 600 }}>{name}</span>
           <button className={styles.btn} onClick={logout}>Logout</button>
         </div>
       </header>

       <div className={styles.main}>
         <aside className={styles.sidenav}>
           {TABS.map((t) => (
             <button key={t} className={`${styles.navBtn} ${tab === t ? styles.active : ""}`} onClick={() => setTab(t)}>
               {t}
             </button>
           ))}
         </aside>

         <section className={styles.content}>
           {tab === "Analytics" && (
             <div className={styles.panel}>
               <div className={styles.cards}>
                 {metrics.map((m, i) => (
                   <div key={i} className={styles.card}>
                     <div className={styles.cardTitle}>{m.title}</div>
                     <div className={styles.cardValue}>{m.value}</div>
                   </div>
                 ))}
               </div>
               <div style={{ color: "#6b7a90" }}>Charts placeholder (daily appointments, cancellations, patient flow)</div>
             </div>
           )}

           {tab === "Doctors" && (
             <div className={styles.panel}>
               <h3>Doctors Management</h3>
               <div className={styles.formRow} style={{ marginTop: 8 }}>
                 <div className={styles.col6}><label>Name</label><input className={styles.input} value={formDoctor.name} onChange={(e)=>setFormDoctor({ ...formDoctor, name: e.target.value })} /></div>
                 <div className={styles.col6}><label>Specialization</label><input className={styles.input} value={formDoctor.specialization} onChange={(e)=>setFormDoctor({ ...formDoctor, specialization: e.target.value })} /></div>
                 <div className={styles.col6}><label>Status</label><select className={styles.select} value={formDoctor.status} onChange={(e)=>setFormDoctor({ ...formDoctor, status: e.target.value })}><option>Active</option><option>Inactive</option></select></div>
                 <div className={styles.col6} style={{ display: "flex", alignItems: "end", gap: 8 }}>
                   <button className={styles.btn} onClick={()=>{
                     if(!formDoctor.name) return; if(formDoctor.id){ setDoctors(ds=>ds.map(d=>d.id===formDoctor.id?{...formDoctor}:d)); } else { setDoctors(ds=>[...ds,{...formDoctor,id:nextId(ds)}]); }
                     setFormDoctor({ id:null, name:"", specialization:"", status:"Active" });
                   }}>{formDoctor.id?"Update":"Add"}</button>
                   <button className={styles.btn} onClick={()=>setFormDoctor({ id:null, name:"", specialization:"", status:"Active" })}>Clear</button>
                 </div>
               </div>
               <div className={styles.actions}>
                 <input id="doc-import" type="file" accept=".csv" style={{ display:"none" }} onChange={(e)=>{
                   const file=e.target.files?.[0]; if(!file) return; const fr=new FileReader(); fr.onload=()=>{ const rows=parseCSV(String(fr.result)); const [h,...data]=rows; const idx={name:h.indexOf("name"), specialization:h.indexOf("specialization"), status:h.indexOf("status")}; const mapped=data.map(r=>({ id:nextId(doctors), name:r[idx.name]||"", specialization:r[idx.specialization]||"", status:r[idx.status]||"Active" })); setDoctors(d=>[...d,...mapped]); }; fr.readAsText(file); e.target.value=""; }} />
                 <button className={styles.btn} onClick={()=>document.getElementById("doc-import").click()}>Import CSV</button>
                 <button className={styles.btn} onClick={()=>downloadCSV(doctors,["name","specialization","status"],"doctors.csv")}>Export CSV</button>
               </div>
               <table className={styles.table}>
                 <thead>
                   <tr>
                     <th>Name</th><th>Specialization</th><th>Status</th><th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {doctors.map(d=> (
                     <tr key={d.id}>
                       <td>{d.name}</td><td>{d.specialization}</td><td>{d.status}</td>
                       <td style={{ display:"flex", gap:6 }}>
                         <button className={styles.btn} onClick={()=>setFormDoctor(d)}>Edit</button>
                         <button className={styles.btn} onClick={()=>setDoctors(ds=>ds.filter(x=>x.id!==d.id))}>Delete</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}

           {tab === "Schedules" && (
             <div className={styles.panel}>
               <h3>Schedules</h3>
               <div className={styles.formRow}>
                 <div className={styles.col6}><label>Doctor</label><select className={styles.select} value={formSlot.doctor} onChange={(e)=>setFormSlot({ ...formSlot, doctor:e.target.value })}>{doctors.map(d=>(<option key={d.id}>{d.name}</option>))}</select></div>
                 <div className={styles.col6}><label>Date</label><input type="date" className={styles.input} value={formSlot.date} onChange={(e)=>setFormSlot({ ...formSlot, date:e.target.value })} /></div>
                 <div className={styles.col6}><label>Start</label><input type="time" className={styles.input} value={formSlot.start} onChange={(e)=>setFormSlot({ ...formSlot, start:e.target.value })} /></div>
                 <div className={styles.col6}><label>End</label><input type="time" className={styles.input} value={formSlot.end} onChange={(e)=>setFormSlot({ ...formSlot, end:e.target.value })} /></div>
               </div>
               <div className={styles.actions}><button className={styles.btn} onClick={()=>{ if(!formSlot.date||!formSlot.start||!formSlot.end) return; setSlots(s=>[...s,{ id: nextId(s), ...formSlot }]); setFormSlot({ doctor: doctors[0]?.name||"", date:"", start:"", end:"" }); }}>Add Slot</button></div>
               <table className={styles.table}>
                 <thead><tr><th>Doctor</th><th>Date</th><th>Start</th><th>End</th><th>Actions</th></tr></thead>
                 <tbody>
                   {slots.map(s=> (
                     <tr key={s.id}><td>{s.doctor}</td><td>{s.date}</td><td>{s.start}</td><td>{s.end}</td><td><button className={styles.btn} onClick={()=>setSlots(x=>x.filter(y=>y.id!==s.id))}>Delete</button></td></tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}

           {tab === "Patients" && (
             <div className={styles.panel}>
               <h3>Patients Database</h3>
               <div className={styles.formRow} style={{ marginTop: 8 }}>
                 <div className={styles.col6}><label>Name</label><input className={styles.input} value={formPatient.name} onChange={(e)=>setFormPatient({ ...formPatient, name:e.target.value })} /></div>
                 <div className={styles.col6}><label>Age</label><input className={styles.input} type="number" value={formPatient.age} onChange={(e)=>setFormPatient({ ...formPatient, age:e.target.value })} /></div>
                 <div className={styles.col6}><label>Visits</label><input className={styles.input} type="number" value={formPatient.visits} onChange={(e)=>setFormPatient({ ...formPatient, visits:e.target.value })} /></div>
                 <div className={styles.col6}><label>Last Visit</label><input className={styles.input} type="date" value={formPatient.lastVisit} onChange={(e)=>setFormPatient({ ...formPatient, lastVisit:e.target.value })} /></div>
                 <div className={styles.col12} style={{ display:"flex", gap:8 }}>
                   <button className={styles.btn} onClick={()=>{ if(!formPatient.name) return; if(formPatient.id){ setPatients(ps=>ps.map(p=>p.id===formPatient.id?{...formPatient}:p)); } else { setPatients(ps=>[...ps,{...formPatient,id:nextId(ps)}]); } setFormPatient({ id:null, name:"", age:"", visits:"", lastVisit:"" }); }}>Save</button>
                   <button className={styles.btn} onClick={()=>setFormPatient({ id:null, name:"", age:"", visits:"", lastVisit:"" })}>Clear</button>
                 </div>
               </div>
               <div className={styles.actions}>
                 <input id="pt-import" type="file" accept=".csv" style={{ display:"none" }} onChange={(e)=>{ const f=e.target.files?.[0]; if(!f) return; const fr=new FileReader(); fr.onload=()=>{ const rows=parseCSV(String(fr.result)); const [h,...data]=rows; const idx={name:h.indexOf("name"), age:h.indexOf("age"), visits:h.indexOf("visits"), lastVisit:h.indexOf("lastVisit")}; const mapped=data.map(r=>({ id:nextId(patients), name:r[idx.name]||"", age:Number(r[idx.age]||0), visits:Number(r[idx.visits]||0), lastVisit:r[idx.lastVisit]||"" })); setPatients(p=>[...p,...mapped]); }; fr.readAsText(f); e.target.value=""; }} />
                 <button className={styles.btn} onClick={()=>document.getElementById("pt-import").click()}>Import CSV</button>
                 <button className={styles.btn} onClick={()=>downloadCSV(patients,["name","age","visits","lastVisit"],"patients.csv")}>Export CSV</button>
               </div>
               <table className={styles.table}>
                 <thead>
                   <tr>
                     <th>Name</th><th>Age</th><th>Visits</th><th>Last Visit</th>
                   </tr>
                 </thead>
                 <tbody>
                   {patients.map(p=> (
                     <tr key={p.id} onClick={()=>setFormPatient(p)}>
                       <td>{p.name}</td><td>{p.age}</td><td>{p.visits}</td><td>{p.lastVisit}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}

           {tab === "Inventory" && (
             <div className={styles.panel}>
               <h3>Inventory</h3>
               <div className={styles.formRow} style={{ marginTop: 8 }}>
                 <div className={styles.col6}><label>Item</label><input className={styles.input} value={formInv.item} onChange={(e)=>setFormInv({ ...formInv, item:e.target.value })} /></div>
                 <div className={styles.col6}><label>Type</label><select className={styles.select} value={formInv.type} onChange={(e)=>setFormInv({ ...formInv, type:e.target.value })}><option>Medicine</option><option>Diagnostics</option><option>Department</option></select></div>
                 <div className={styles.col6}><label>Stock</label><input className={styles.input} type="number" value={formInv.stock} onChange={(e)=>setFormInv({ ...formInv, stock:e.target.value })} /></div>
                 <div className={styles.col6}><label>Status</label><select className={styles.select} value={formInv.status} onChange={(e)=>setFormInv({ ...formInv, status:e.target.value })}><option>OK</option><option>Low</option></select></div>
                 <div className={styles.col12} style={{ display:"flex", gap:8 }}>
                   <button className={styles.btn} onClick={()=>{ if(!formInv.item) return; if(formInv.id){ setInventory(inv=>inv.map(i=>i.id===formInv.id?{...formInv}:i)); } else { setInventory(inv=>[...inv,{...formInv,id:nextId(inv)}]); } setFormInv({ id:null, item:"", type:"Medicine", stock:"", status:"OK" }); }}>Save</button>
                   <button className={styles.btn} onClick={()=>setFormInv({ id:null, item:"", type:"Medicine", stock:"", status:"OK" })}>Clear</button>
                 </div>
               </div>
               <table className={styles.table}>
                 <thead>
                   <tr>
                     <th>Item</th><th>Type</th><th>Stock</th><th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {inventory.map(i=> (
                     <tr key={i.id} onClick={()=>setFormInv(i)}>
                       <td>{i.item}</td><td>{i.type}</td><td>{i.stock}</td><td>{i.status}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}

           {tab === "Reports" && (
             <div className={styles.panel}>
               <h3>Reports</h3>
               <div className={styles.formRow}>
                 <div className={styles.col6}>
                   <label>Type</label>
                   <select className={styles.select}>
                     <option>Management</option>
                     <option>Billing</option>
                     <option>Government Audit</option>
                   </select>
                 </div>
                 <div className={styles.col6}>
                   <label>Date Range</label>
                   <input type="date" className={styles.input} />
                 </div>
               </div>
               <div className={styles.actions}>
                 <button className={styles.btn} onClick={()=>{
                   const rows = metrics.map(m=>({ metric:m.title, value:m.value }));
                   downloadCSV(rows,["metric","value"],"analytics_report.csv");
                 }}>Export CSV</button>
               </div>
             </div>
           )}

           {tab === "Announcements" && (
             <div className={styles.panel}>
               <h3>Bulk Announcements</h3>
               <div className={styles.formRow}>
                 <div className={styles.col6}><label>Audience</label><select className={styles.select} value={annForm.audience} onChange={(e)=>setAnnForm({ ...annForm, audience:e.target.value })}><option>All Patients</option><option>By Department</option></select></div>
                 <div className={styles.col12}><label>Message</label><input className={styles.input} value={annForm.message} onChange={(e)=>setAnnForm({ ...annForm, message:e.target.value })} placeholder="e.g., Vaccination drive this weekend" /></div>
               </div>
               <div className={styles.actions}><button className={styles.btn} onClick={()=>{ if(!annForm.message) return; setAnnouncements(a=>[{ id: nextId(a), ...annForm, date: new Date().toISOString() }, ...a]); setAnnForm({ audience:"All Patients", message:"" }); }}>Send Now</button></div>
               <table className={styles.table}>
                 <thead><tr><th>When</th><th>Audience</th><th>Message</th></tr></thead>
                 <tbody>
                   {announcements.map(a=> (
                     <tr key={a.id}><td>{a.date.slice(0,19).replace('T',' ')}</td><td>{a.audience}</td><td>{a.message}</td></tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}

           {tab === "Security" && (
             <div className={styles.panel}>
               <h3>Security & Privacy</h3>
               <div className={styles.formRow}>
                 <div className={styles.col6}><label>Backups</label><button className={styles.btn}>Export Backup</button></div>
                 <div className={styles.col6}><label>Encryption</label><select className={styles.select}><option>Enabled</option><option>Disabled</option></select></div>
                 <div className={styles.col12}><label>Data Retention</label><input className={styles.input} placeholder="e.g., 7 years" /></div>
               </div>
               <div style={{ color: "#6b7a90", marginTop: 8 }}>Note: These are UI placeholders; wire to backend for real effects.</div>
             </div>
           )}
         </section>
       </div>
     </div>
   );
 }
