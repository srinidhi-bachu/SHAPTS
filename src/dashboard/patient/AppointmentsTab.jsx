import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./AppointmentsTab.css";

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Sharma", date: "2025-11-10", time: "10:30 AM", status: "Booked" },
    { id: 2, doctor: "Dr. Rao", date: "2025-11-12", time: "12:00 PM", status: "Booked" },
  ]);

  return (
    <div className="pt-app">
      <div className="pt-app-hero">
        <DotLottieReact src="/Marking a Calendar.lottie" autoplay loop style={{ width: 180, height: 180 }} />
        <div>
          <h3>Manage your appointments</h3>
          <p>Book, reschedule or cancel with one click.</p>
        </div>
      </div>

      <div className="pt-app-actions">
        <button onClick={() => alert("Book flow (mock)")}>Book</button>
      </div>

      <div className="pt-app-table-wrap">
        <table className="pt-app-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
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
