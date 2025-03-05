import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

import { 
  fetchAllMedicalReports,
  addToCollection,
  removeFromCollection,
  getResearcherCollection
} from "../controllers/researcherMedicalReport.controller.js";

const router = express.Router();

// Get all medical reports
router.get("/get-medical-reports", protectRoute, fetchAllMedicalReports); // http://localhost:3000/api/medical/researcher/get-medical-reports

// Collection management routes
router.post("/collection/:reportId", protectRoute, addToCollection); // Add report to collection
router.delete("/collection/:reportId", protectRoute, removeFromCollection); // Remove report from collection
router.get("/collection", protectRoute, getResearcherCollection); // Get researcher's collection

export default router;
