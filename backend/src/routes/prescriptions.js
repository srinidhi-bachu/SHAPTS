const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");

// ✅ Test route to confirm
router.get("/", (req, res) => {
  res.send("Prescriptions route is working ✅");
});

// ✅ Create prescription
router.post("/create", async (req, res) => {
  try {
    const p = await Prescription.create(req.body);
    res.status(201).json({ message: "Prescription created", prescription: p });
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err.message });
  }
});

module.exports = router;
