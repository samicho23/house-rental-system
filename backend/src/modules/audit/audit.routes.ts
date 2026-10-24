/**
 * Audit (admin) module routes: /api/admin/audit
 */
import { Router } from "express";
import { requireRole } from "../../middleware/authorize";
import { auditController } from "./audit.controller";

const router = Router();

router.get("/", ...requireRole("ADMIN"), auditController.list);

export default router;
