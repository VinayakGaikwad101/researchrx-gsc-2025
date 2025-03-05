import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: {
    type: String,
    default: "",
    maxlength: 500,
  },
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  researcherCollections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of researchers who have collected this report
});

const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);

export default MedicalReport;
