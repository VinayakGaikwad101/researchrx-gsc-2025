import express, { urlencoded } from "express";
import dotenv from "dotenv";
import mongoDBConnect from "./database/mongoose.database.js";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initializeSocket } from "./config/socket.config.js";
import authPatientRouter from "./router/patient.router.js";
import authResearcherRouter from "./router/researcher.router.js";
import patientMedicalReportRouter from "./router/patient.medicalReport.router.js";
import researcherMedicalReportRouter from "./router/researcher.medicalReport.router.js";
import commentRouter from "./router/comment.router.js";
import blogRouter from "./router/blog.router.js";
import blogTemplateRouter from "./router/blog.template.router.js";
import periodicTableRouter from "./router/periodicTable.router.js";
import chatRouter from "./router/chat.router.js";
import drugContributionRouter from "./router/drugContribution.router.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = initializeSocket(server);

// Make io accessible in routes
app.set("io", io);

// Configure allowed origins based on environment
const allowedOrigins = [
  process.env.PATIENT_FRONTEND_URL,
  process.env.RESEARCHER_FRONTEND_URL,
].filter(Boolean); // Remove any undefined values

// Handle CORS - Simplified for production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, allow all origins for now
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    // In development, check allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true })); // for form submissions
app.use(express.static("public")); // SSR for blog templates
app.set("view engine", "ejs");

app.use("/api/auth", authPatientRouter);
app.use("/api/main/auth", authResearcherRouter);
app.use("/api/medical/patient", patientMedicalReportRouter);
app.use("/api/medical/researcher", researcherMedicalReportRouter);
app.use("/api/comment", commentRouter);
app.use("/api/blog", blogRouter);
app.use("/api/templates/blog", blogTemplateRouter);
app.use("/api/researcher", periodicTableRouter);
app.use("/api/chat", chatRouter);
app.use("/api/drugs", drugContributionRouter);

app.get("/", (req, res) => {
  try {
    console.log("API health: working");
    res.status(200).json({ message: "Server is running", success: true });
  } catch (error) {
    console.error("Error in API health check: ", error);
    res.status(500).json({ message: "Server error", success: false });
  }
});

mongoDBConnect();

server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
