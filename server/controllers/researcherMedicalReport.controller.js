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

export const addToCollection = async (req, res) => {
  try {
    const { reportId } = req.params;
    const researcherId = req.user._id;

    const report = await MedicalReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found", success: false });
    }

    // Check if report is already in collection
    if (report.researcherCollections.includes(researcherId)) {
      return res.status(400).json({ 
        message: "Report already in collection", 
        success: false 
      });
    }

    // Add researcher to collections
    report.researcherCollections.push(researcherId);
    await report.save();

    return res.status(200).json({
      message: "Report added to collection",
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error adding report to collection: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const removeFromCollection = async (req, res) => {
  try {
    const { reportId } = req.params;
    const researcherId = req.user._id;

    const report = await MedicalReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found", success: false });
    }

    // Remove researcher from collections
    report.researcherCollections = report.researcherCollections.filter(
      (id) => id.toString() !== researcherId.toString()
    );
    await report.save();

    return res.status(200).json({
      message: "Report removed from collection",
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error removing report from collection: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getResearcherCollection = async (req, res) => {
  try {
    const researcherId = req.user._id;
    
    const collectedReports = await MedicalReport.find({
      researcherCollections: researcherId
    }).populate({
      path: "user",
      select: "firstName lastName email phoneNo dob gender",
    });

    return res.status(200).json({
      message: "Collection fetched successfully",
      success: true,
      collectedReports,
    });
  } catch (error) {
    console.error("Error fetching researcher collection: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
