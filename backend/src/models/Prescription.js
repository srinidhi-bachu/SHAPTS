const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicines: [
    {
      name: String,
      dosage: String,
      duration: String,
      notes: String,
    },
  ],
  notes: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
