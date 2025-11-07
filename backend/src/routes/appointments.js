const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// ✅ Test route to verify connection
router.get("/", (req, res) => {
  res.send("Appointments route is working ✅");
});

// ✅ Create appointment
router.post("/create", async (req, res) => {
  try {
    const { patientId, doctorId, date, time, symptoms } = req.body;

    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAppointment = new Appointment({
      patientId,
      doctorId,
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
    console.error("Appointment Error:", error);
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
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

module.exports = router;
