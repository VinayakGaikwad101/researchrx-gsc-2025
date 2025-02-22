import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import {
  patientRegister,
  patientLogin,
  patientLogout,
  verifyEmail,
  regenerateOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/patientAuth.controller.js";
import { contactForm } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/patient/contact-us", contactForm); // http://localhost:3000/api/auth/patient/contact-us
router.post("/patient/register", patientRegister); // http://localhost:3000/api/auth/patient/register
router.post("/patient/verify-email", verifyEmail); // http://localhost:3000/api/auth/patient/verify-email
router.post("/patient/regenerate-otp", regenerateOTP); // http://localhost:3000/api/auth/patient/regenerate-otp
router.post("/patient/login", patientLogin); // http://localhost:3000/api/auth/patient/login
router.post("/patient/logout", patientLogout); // http://localhost:3000/api/auth/patient/logout
router.post("/patient/forgot-password", forgotPassword); // http://localhost:3000/api/auth/patient/forgot-password
router.post("/patient/reset-password", resetPassword); // http://localhost:3000/api/auth/patient/reset-password
router.get("/patient/get-profile", protectRoute, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    success: true,
    user: req.user,
  });
}); // http://localhost:3000/api/auth/patient/get-profile

export default router;
