import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import adminAuthRoutes from "./routes/admin-auth";
import hospitalRoutes from "./routes/hospitals";
import organizationRoutes from "./routes/organizations";
import dashboardRoutes from "./routes/dashboard";
import logsRoutes from "./routes/logs";
import hospitalAuthRoutes from "./routes/hospital-auth";
import hospitalPatientsRoutes from "./routes/hospital-patients";
import hospitalDonorsRoutes from "./routes/hospital-donors";
import hospitalDashboardRoutes from "./routes/hospital-dashboard";
import fileUploadRoutes from "./routes/file-upload";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Admin routes
  app.use("/api/admin/auth", adminAuthRoutes);
  app.use("/api/admin/hospitals", hospitalRoutes);
  app.use("/api/admin/organizations", organizationRoutes);
  app.use("/api/admin/dashboard", dashboardRoutes);
  app.use("/api/admin/logs", logsRoutes);

  // Hospital routes
  app.use("/api/hospital/auth", hospitalAuthRoutes);
  app.use("/api/hospital/patients", hospitalPatientsRoutes);
  app.use("/api/hospital/donors", hospitalDonorsRoutes);
  app.use("/api/hospital/dashboard", hospitalDashboardRoutes);
  app.use("/api/hospital/upload", fileUploadRoutes);

  return app;
}
