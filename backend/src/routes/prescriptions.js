const express = require("express");
const Prescription = require("../models/Prescription");
const router = express.Router();

// ✅ Create a prescription
router.post("/create", async (req, res) => {
  try {
    const { doctorId, patientId, medicines, notes } = req.body;

    if (!doctorId || !patientId || !medicines || medicines.length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newPrescription = new Prescription({
      doctorId,
      patientId,
      medicines,
      notes,
    });

    await newPrescription.save();
    res
      .status(201)
      .json({ message: "Prescription created successfully", prescription: newPrescription });
  } catch (err) {
    console.error("❌ Prescription Error:", err);
    res.status(500).json({ message: "Error creating prescription" });
  }
});

// ✅ Get all prescriptions for a doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.params.doctorId })
      .populate("patientId", "name email")
      .populate("doctorId", "name");
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions" });
  }
});

module.exports = router;
