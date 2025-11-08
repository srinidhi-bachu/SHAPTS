import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedSearch from "../../components/AnimatedSearch/AnimatedSearch";
import AmbulanceButton from "../../components/AmbulanceButton/AmbulanceButton";
import "./BookingPage.css";

const doctorsByHospital = {
  Hyderabad: [
    { id: "sathwik1", backendId: "690cc78c9b3a288bba4c3b56", name: "Dr. Sathwik", specialization: "General Physician", hospital: "Apollo Hospital" },
    { id: "d1", name: "Dr. Priya Verma", specialization: "Cardiologist", hospital: "Yashoda Hospital" },
    { id: "d3", name: "Dr. Arjun Rao", specialization: "Dermatologist", hospital: "AIG Hospital" },
  ],
  Bangalore: [
    { name: "Dr. Priya Singh", specialization: "Pediatrician", hospital: "Fortis Hospital" },
    { name: "Dr. Nikhil Sharma", specialization: "Neurologist", hospital: "Manipal Hospital" },
  ],
  Chennai: [
    { name: "Dr. Kavitha Das", specialization: "Gynecologist", hospital: "MIOT Hospital" },
    { name: "Dr. Manoj Varma", specialization: "ENT Specialist", hospital: "Apollo Hospital" },
  ],
};

const allSpecs = [
  "Cardiologist",
  "Dermatologist",
  "Orthopedic",
  "Pediatrician",
  "Neurologist",
  "Gynecologist",
  "ENT Specialist",
  "General Physician",
];

const allLangs = ["Telugu", "Hindi", "English", "Tamil", "Kannada"];

const BookingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [city, setCity] = useState("Hyderabad");
  const [specialization, setSpecialization] = useState("");
  const [language, setLanguage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    filterDoctors();
  }, [city, specialization, language, searchQuery]);

  const filterDoctors = () => {
    let doctors = doctorsByHospital[city] || [];
    if (specialization)
      doctors = doctors.filter((doc) =>
        doc.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    if (language)
      doctors = doctors.filter((doc) =>
        (doc.languages || []).includes(language)
      );
    if (searchQuery)
      doctors = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredDoctors(doctors);
  };

  // ✅ Appointment booking logic connected to backend
  const handleBooking = async () => {
    if (!selectedDoctor) return;

    try {
      const patientId = localStorage.getItem("userId");
      const doctorId = selectedDoctor.backendId || "690cc78c9b3a288bba4c3b56"; // fallback to Sathwik’s ID
      const date = "2025-11-10"; // You can make this dynamic later
      const time = "09:30";

      if (!patientId || !doctorId) {
        return alert("Missing patient or doctor ID. Please login again.");
      }

      const res = await axios.post("http://localhost:5000/api/appointments/create", {
        patientId,
        doctorId,
        date,
        time,
        symptoms: "N/A",
      });

      console.log("Appointment Response:", res.data);
      alert("✅ Appointment booked successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ Failed to book appointment.");
    }
  };

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h2>Book an Appointment</h2>
        <AmbulanceButton />
      </div>

      <div className="filters">
        <div className="filter-item">
          <label>City</label>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            {Object.keys(doctorsByHospital).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Specialization</label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All</option>
            {allSpecs.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">All</option>
            {allLangs.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <AnimatedSearch
          placeholder="Search doctor by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="recommended-section">
        <h3>Recommended Doctors in {city}</h3>
        <div className="doctor-cards">
          {filteredDoctors.map((doctor, index) => (
            <div className="doctor-card" key={index}>
              <h4>{doctor.name}</h4>
              <p>{doctor.specialization}</p>
              <p>{doctor.hospital}</p>
              <button onClick={() => openModal(doctor)}>Book Appointment</button>
            </div>
          ))}
          {filteredDoctors.length === 0 && <p>No doctors found.</p>}
        </div>
      </div>

      {isModalOpen && selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Appointment</h3>
            <p>
              <strong>Doctor:</strong> {selectedDoctor.name}
            </p>
            <p>
              <strong>Specialization:</strong> {selectedDoctor.specialization}
            </p>
            <p>
              <strong>Hospital:</strong> {selectedDoctor.hospital}
            </p>
            <div className="modal-actions">
              <button onClick={handleBooking}>Confirm Booking</button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
