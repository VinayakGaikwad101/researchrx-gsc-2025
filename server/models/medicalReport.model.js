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
});

const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);

export default MedicalReport;
