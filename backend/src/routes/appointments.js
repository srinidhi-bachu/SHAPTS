const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// ✅ Health check route
router.get("/", (req, res) => {
  res.send("🩺 Appointments route is active and working fine!");
});

// ✅ Create appointment (main route)
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorId, date, time, symptoms } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new appointment document
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      symptoms: symptoms || "Not specified",
    });

    // Save to MongoDB
    await newAppointment.save();

    console.log("✅ Appointment saved:", newAppointment);

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
    });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

module.exports = router;
