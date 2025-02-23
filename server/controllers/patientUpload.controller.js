import cloudinary from "../config/cloudinary.config.js";
import upload from "../config/multer.config.js";
import fs from "fs";
import MedicalReport from "../models/medicalReport.model.js";

// Upload Medical Report
export const uploadMedicalReport = (req, res) => {
  if (req.user.role !== "Patient") {
    return res.status(403).json({
      message: "Forbidden - Only patients can upload medical reports",
      success: false,
    });
  }

  upload.single("medicalReport")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file provided.",
        success: false,
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Invalid file format. Only PDF files are allowed.",
        success: false,
      });
    }

    const { name, description = "" } = req.body;

    const existingMedicalReport = await MedicalReport.findOne({
      name,
      user: req.user._id,
    });
    if (existingMedicalReport) {
      return res.status(400).json({
        message: "Report with same name exists, use another name.",
        success: false,
      });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "medical_reports",
      });

      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting temporary file: ", unlinkErr);
        }
      });

      const newMedicalReport = new MedicalReport({
        name,
        description,
        url: result.secure_url,
        user: req.user._id,
      });

      await newMedicalReport.save();

      res.json({
        message: "Medical report uploaded successfully.",
        success: true,
        report: newMedicalReport,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Error uploading file.",
        success: false,
      });
    }
  });
};

// Remove Medical Report
export const removeMedicalReport = async (req, res) => {
  const { id } = req.body;
  try {
    const medicalReport = await MedicalReport.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!medicalReport) {
      return res.status(404).json({
        message:
          "Medical report not found or you do not have permission to delete this report.",
        success: false,
      });
    }

    cloudinary.uploader.destroy(medicalReport.url, async (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Error deleting report.",
          success: false,
        });
      }

      await MedicalReport.findByIdAndDelete(id);
      res.json({
        message: "Medical report removed successfully.",
        success: true,
      });
    });
  } catch (error) {
    console.error("Error in removing medical report: ", error);
    res.status(500).json({
      message: "Error in remove patient medical report controller",
      success: false,
    });
  }
};

// Get All Medical Reports
export const getAllMedicalReports = async (req, res) => {
  if (req.user.role !== "Patient") {
    return res.status(403).json({
      message: "Forbidden - Only patients can view medical reports",
      success: false,
    });
  }

  try {
    const medicalReports = await MedicalReport.find({ user: req.user._id });
    res.json({
      message: "Medical reports retrieved successfully.",
      success: true,
      reports: medicalReports,
    });
  } catch (error) {
    console.error("Error in retrieving medical reports: ", error);
    res.status(500).json({
      message: "Error in getting all medical reports controller",
      success: false,
    });
  }
};

// Rename Medical Report
export const renameMedicalReport = async (req, res) => {
  if (req.user.role !== "Patient") {
    return res.status(403).json({
      message: "Forbidden - Only patients can rename medical reports",
      success: false,
    });
  }

  const { id, newName } = req.body;

  try {
    const existingMedicalReport = await MedicalReport.findOne({
      name: newName,
      user: req.user._id,
    });
    if (existingMedicalReport) {
      return res.status(400).json({
        message: "Report with same name already exists.",
        success: false,
      });
    }
    const medicalReport = await MedicalReport.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!medicalReport) {
      return res.status(404).json({
        message:
          "Medical report not found or you do not have permission to rename this report.",
        success: false,
      });
    }

    medicalReport.name = newName;
    await medicalReport.save();
    res.json({
      message: "Medical report renamed successfully.",
      success: true,
      report: medicalReport,
    });
  } catch (error) {
    console.error("Error in renaming medical report: ", error);
    res.status(500).json({
      message: "Error in renaming medical report controller",
      success: false,
    });
  }
};
