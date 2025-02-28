import express from "express";
import { periodicTable } from "../controllers/periodicTable.controller.js";
import protectRoleSpecificRoute from "../middlewares/protectRole.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
const router = express.Router();

router.get(
  "/periodic-table",
  protectRoute,
  protectRoleSpecificRoute,
  periodicTable
);

export default router;
