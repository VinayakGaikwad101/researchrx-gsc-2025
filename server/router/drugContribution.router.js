import { Router } from "express";
import {
  addDrugContribution,
  getDrugContributions,
  searchBySmiles,
  addNote,
  toggleVisibility,
  searchPublicDrugs
} from "../controllers/drugContribution.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router = Router();

// Protected routes (require authentication)
router.use(protectRoute);

// Drug contribution routes
router.post("/", addDrugContribution);
router.get("/", getDrugContributions);
router.get("/search", searchBySmiles);
router.post("/:drugId/notes", addNote);
router.patch("/:drugId/visibility", toggleVisibility);
router.get("/public/search", searchPublicDrugs);

export default router;
