/**
 * API root router - mounts every module under /api.
 */
import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import propertiesRoutes from "../modules/properties/properties.routes";
import applicationsRoutes from "../modules/applications/applications.routes";
import leasesRoutes from "../modules/leases/leases.routes";
import paymentsRoutes from "../modules/payments/payments.routes";
import maintenanceRoutes from "../modules/maintenance/maintenance.routes";
import notificationsRoutes from "../modules/notifications/notifications.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import usersRoutes from "../modules/users/users.routes";
import reportsRoutes from "../modules/reports/reports.routes";
import metaRoutes from "../modules/meta/meta.routes";
import healthRoutes from "../modules/health/health.routes";
import auditRoutes from "../modules/audit/audit.routes";
import contactRoutes from "../modules/contact/contact.routes";
import resultsRoutes from "../modules/results/results.routes";
import adminResultsRoutes from "../modules/results/results.admin.routes";
import newsRoutes from "../modules/news/news.routes";
import adminNewsRoutes from "../modules/news/news.admin.routes";
import faydaRoutes from "../modules/fayda/fayda.routes";
import authorizationRoutes from "../modules/authorizations/authorization.routes";
import verificationRoutes from "../modules/verification/verification.routes";

const router = Router();

// module mounts
router.use("/auth", authRoutes);
router.use("/properties", propertiesRoutes);
router.use("/applications", applicationsRoutes);
router.use("/leases", leasesRoutes);
router.use("/payments", paymentsRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin/users", usersRoutes);
router.use("/admin/reports", reportsRoutes);
router.use("/admin/audit", auditRoutes);
router.use("/contact", contactRoutes);
router.use("/results", resultsRoutes);
router.use("/admin/results", adminResultsRoutes);
router.use("/news", newsRoutes);
router.use("/admin/news", adminNewsRoutes);
router.use("/fayda", faydaRoutes);
router.use("/authorizations", authorizationRoutes);
router.use("/verification", verificationRoutes);
router.use("/public", metaRoutes);
router.use("/health", healthRoutes);

// GET /api - service info
router.get("/", (_req, res) => {
  res.json({
    message: "Hello, world!",
    service: "faydarent-backend",
    docs: "/api/health for liveness, /api/public/stats for landing counters",
  });
});

export default router;
