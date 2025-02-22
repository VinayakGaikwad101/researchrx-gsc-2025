import express, { urlencoded } from "express";
import dotenv from "dotenv";
import mongoDBConnect from "./database/mongoose.database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authPatientRouter from "./router/patient.router.js";
import authResearcherRouter from "./router/researcher.router.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      process.env.PATIENT_FRONTEND_URL,
      process.env.RESEARCHER_FRONTEND_URL,
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true })); // for form submissions

app.use("/api/messages", messageRouter);
app.use("/api/auth", authPatientRouter);
app.use("/api/main/auth", authResearcherRouter);

mongoDBConnect();
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
