import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

import {
  uploadMedicalReport,
  removeMedicalReport,
  renameMedicalReport,
  getAllMedicalReports,
} from "../controllers/patientUpload.controller.js";

const router = express.Router();

router.post("/add-medical-report", protectRoute, uploadMedicalReport); // http://localhost:3000/api/medical/patient/add-medical-report

router.delete("/delete-medical-report", protectRoute, removeMedicalReport); // http://localhost:3000/api/medical/patient/delete-medical-report

router.get("/get-medical-reports", protectRoute, getAllMedicalReports); // http://localhost:3000/api/medical/patient/get-medical-reports

router.put("/rename-medical-report", protectRoute, renameMedicalReport); // http://localhost:3000/api/medical/patient/rename-medical-report

export default router;
