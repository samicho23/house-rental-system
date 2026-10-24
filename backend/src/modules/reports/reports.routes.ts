/**
 * Reports (admin) module routes: /api/admin/reports
 */
import { Router } from "express";
import { reportsController } from "./reports.controller";
import { requireRole } from "../../middleware/authorize";

const router = Router();

router.get("/", ...requireRole("ADMIN"), reportsController.get);

export default router;
