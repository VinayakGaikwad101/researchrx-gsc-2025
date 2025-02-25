import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

import { fetchAllMedicalReports } from "../controllers/researcherMedicalReport.controller.js";

const router = express.Router();

router.get("/get-medical-reports", protectRoute, fetchAllMedicalReports); // http://localhost:3000/api/medical/researcher/get-medical-reports

export default router;
