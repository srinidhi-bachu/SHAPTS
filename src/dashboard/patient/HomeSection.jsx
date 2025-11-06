import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from "./HomeSection.module.css";

export default function HomeSection({ setTab }) {
  const recent = [
    { id: 101, doctor: "Dr. Sharma", date: "2025-11-10", time: "10:30 AM", status: "Completed" },
    { id: 102, doctor: "Dr. Rao", date: "2025-11-12", time: "12:00 PM", status: "Booked" },
    { id: 103, doctor: "Dr. Iyer", date: "2025-11-16", time: "09:15 AM", status: "Booked" },
  ];

  return (
    <div className={styles.home}>
      <section className={`${styles.section} ${styles.anim}`}>
        <h3 className={styles.title}>Quick actions</h3>
        <div className={`${styles.hrow} ${styles.stagger}`}>
          <div className={`${styles.card} ${styles.anim}`}>
            <DotLottieReact src="/Marking a Calendar.lottie" autoplay loop style={{ width: 64, height: 64 }} />
            <div>
              <p className={styles.cardTitle}>Book appointment</p>
              <p className={styles.cardSub}>Find slots with top doctors</p>
              <div className={styles.actions}>
                <button className={styles.btnPrimary} onClick={() => { window.location.href = "/patient-dashboard/book"; }}>Book now</button>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.anim}`}>
            <DotLottieReact src="/Search Doctor.lottie" autoplay loop style={{ width: 64, height: 64 }} />
            <div>
              <p className={styles.cardTitle}>Search doctor</p>
              <p className={styles.cardSub}>Filter by specialization and city</p>
              <div className={styles.actions}>
                <button className={styles.btnGhost} onClick={() => { window.location.href = "/patient-dashboard/book"; }}>Search</button>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.anim}`}>
            <DotLottieReact src="/Customised report.lottie" autoplay loop style={{ width: 64, height: 64 }} />
            <div>
              <p className={styles.cardTitle}>Medical reports</p>
              <p className={styles.cardSub}>View or download documents</p>
              <div className={styles.actions}>
                <button className={styles.btnGhost} onClick={() => setTab && setTab("reports")}>Open</button>
              </div>
            </div>
          </div>
        </div>

        <h3 className={styles.title} style={{ marginTop: 16 }}>Recent appointments</h3>
        <div className={`${styles.tableWrap} ${styles.anim}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id}>
                  <td>{r.doctor}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td><span className={styles.badge}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className={styles.title} style={{ marginTop: 16 }}>Recommended for you</h3>
        <div className={`${styles.recs} ${styles.stagger}`}>
          {[
            { id: 201, name: "Dr. Priya Verma", spec: "Cardiologist", tag: "High Rated" },
            { id: 202, name: "Dr. Arjun Rao", spec: "Dermatologist", tag: "Near you" },
            { id: 203, name: "Dr. Sneha Iyer", spec: "Pediatrician", tag: "Popular" },
          ].map((d) => (
            <div key={d.id} className={`${styles.recItem} ${styles.anim}`}>
              <div className={styles.recInfo}>
                <DotLottieReact src="/Search Doctor.lottie" autoplay loop style={{ width: 40, height: 40 }} />
                <div className={styles.recMeta}>
                  <p className={styles.recName}>{d.name}</p>
                  <p className={styles.recSpec}>{d.spec}</p>
                </div>
                <span className={styles.chip}>{d.tag}</span>
              </div>
              <div className={styles.recActions}>
                <button className={styles.btnGhost} onClick={() => setTab && setTab("doctors")}>View</button>
                <button className={styles.btnPrimary} onClick={() => { window.location.href = "/patient-dashboard/book"; }}>Book</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className={`${styles.section} ${styles.rightCol} ${styles.anim}`}>
        <div>
          <h3 className={styles.title}>Upcoming</h3>
          <div className={`${styles.card} ${styles.anim}`}>
            <DotLottieReact src="/Marking a Calendar.lottie" autoplay loop style={{ width: 54, height: 54 }} />
            <div>
              <p className={styles.cardTitle}>Dr. Rao • Dermatology</p>
              <p className={styles.cardSub}>12 Nov 2025 • 12:00 PM</p>
              <div className={styles.actions}>
                <button className={styles.btnGhost} onClick={() => { window.location.href = "/patient-dashboard/book"; }}>Manage</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className={styles.title}>Tips</h3>
          <div className={`${styles.card} ${styles.anim}`}>
            <DotLottieReact src="/stars.lottie" autoplay loop style={{ width: 54, height: 54 }} />
            <div>
              <p className={styles.cardTitle}>Rate your last visit</p>
              <p className={styles.cardSub}>Share feedback to help others</p>
              <div className={styles.actions}>
                <button className={styles.btnGhost} onClick={() => setTab && setTab("feedback")}>Give feedback</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
