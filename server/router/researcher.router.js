import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

import {
  researcherRegister,
  researcherLogin,
  researcherLogout,
  verifyEmail,
  regenerateOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/researcherAuth.controller.js";

const router = express.Router();

router.post("/researcher/register", researcherRegister); // http://localhost:3000/api/main/auth/researcher/register
router.post("/researcher/verify-email", verifyEmail); // http://localhost:3000/api/main/auth/researcher/verify-email
router.post("/researcher/regenerate-otp", regenerateOTP); // http://localhost:3000/api/main/auth/researcher/regenerate-otp
router.post("/researcher/login", researcherLogin); // http://localhost:3000/api/main/auth/researcher/login
router.post("/researcher/logout", researcherLogout); // http://localhost:3000/api/main/auth/researcher/logout
router.post("/researcher/forgot-password", forgotPassword); // http://localhost:3000/api/main/auth/researcher/forgot-password
router.post("/researcher/reset-password", resetPassword); // http://localhost:3000/api/main/auth/researcher/reset-password
router.get("/researcher/get-profile", protectRoute, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    success: true,
    user: req.user,
  });
}); // http://localhost:3000/api/main/auth/researcher/get-profile

export default router;
