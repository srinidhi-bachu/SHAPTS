const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const mongoose = require("mongoose");

// ✅ Test route
router.get("/", (req, res) => {
  res.send("Appointments route is working ✅");
});

// ✅ Create appointment (called by patient)
router.post("/create", async (req, res) => {
  try {
    const { patientId, doctorId, doctorName, date, time, symptoms } = req.body;

    if (!patientId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prefer a valid Mongo ObjectId; if invalid or missing, resolve by name
    let resolvedDoctorId = doctorId && mongoose.Types.ObjectId.isValid(doctorId) ? doctorId : null;
    if (!resolvedDoctorId && doctorName) {
      const doc = await User.findOne({ name: doctorName, role: "doctor" });
      if (!doc) {
        return res.status(400).json({ message: "Doctor not found" });
      }
      resolvedDoctorId = doc._id;
    }
    if (!resolvedDoctorId) {
      return res.status(400).json({ message: "Doctor identifier missing" });
    }

    const newAppointment = new Appointment({
      patientId,
      doctorId: resolvedDoctorId,
      date,
      time,
      symptoms,
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment booked successfully!",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("❌ Appointment Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all appointments for a specific patient
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    }).populate("doctorId", "name email");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient appointments" });
  }
});

// ✅ Get all appointments for a specific doctor (NEW)
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const doctorAppointments = await Appointment.find({
      doctorId: req.params.doctorId,
    }).populate("patientId", "name email");

    res.status(200).json(doctorAppointments);
  } catch (error) {
    console.error("❌ Doctor Appointment Fetch Error:", error);
    res.status(500).json({ message: "Error fetching doctor's appointments" });
  }
});
// ✅ Get all unique patients for a specific doctor
router.get("/doctor/:doctorId/patients", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email");

    // Extract unique patients
    const uniquePatients = [];
    const seen = new Set();

    appointments.forEach((a) => {
      if (a.patientId && !seen.has(a.patientId._id.toString())) {
        seen.add(a.patientId._id.toString());
        uniquePatients.push(a.patientId);
      }
    });

    res.status(200).json(uniquePatients);
  } catch (error) {
    console.error("Error fetching patients for doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
