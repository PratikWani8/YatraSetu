import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import pilgrimRoutes from "./routes/pilgrimRoutes.js";
import qrScanRoutes from "./routes/qrScanRoutes.js";
import missingPersonRoutes from "./routes/missingPersonRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import waterDistributionRoutes from "./routes/waterDistributionRoutes.js";
import foodDistributionRoutes from "./routes/foodDistributionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import weatherAuthRoutes from "./routes/weatherAuthRoutes.js";
import hospitalAuthRoutes from "./routes/hospitalAuthRoutes.js";

const app = express();

/* Middleware */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Upload Folder */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/pilgrims", pilgrimRoutes);
app.use("/api/qr", qrScanRoutes);
app.use("/api/missing-persons", missingPersonRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/ngo/water-distribution", waterDistributionRoutes);
app.use("/api/ngo/food-distribution", foodDistributionRoutes);
app.use("/api/volunteer/assignments", assignmentRoutes);
app.use("/api/ngo/reports", reportRoutes);
app.use("/api/auth/weather", weatherAuthRoutes);
app.use("/api/auth/hospital", hospitalAuthRoutes);

/* Health Check */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pilgrim Registration API Running 🚀",
  });
});

/* 404 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;