import MedicalReport from "../models/medicalReport.model.js";
import User from "../models/user.model.js";

export const fetchAllMedicalReports = async (req, res) => {
  try {
    const medicalReports = await MedicalReport.find({}).populate({
      path: "user",
      select: "firstName lastName email phoneNo dob gender",
    });
    return res.status(200).json({
      message: "Medical reports fetched successfully",
      success: true,
      medicalReports,
    });
  } catch (error) {
    console.error("Error in researcher fetching medical reports: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
