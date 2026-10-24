/**
 * Results module routes.
 */
import { Router } from "express";
import { resultsController } from "./results.controller";

const router = Router();

router.get("/", resultsController.publicOverview);

export default router;
