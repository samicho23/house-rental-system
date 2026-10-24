/**
 * Administrator results routes: /api/admin/results
 */
import { Router } from "express";
import { requireRole } from "../../middleware/authorize";
import { resultsController } from "./results.controller";

const router = Router();

router.get("/", ...requireRole("ADMIN"), resultsController.adminOverview);

export default router;
