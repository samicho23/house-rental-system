/**
 * Meta (public) module routes: /api/public/*
 */
import { Router } from "express";
import { metaController } from "./meta.controller";

const router = Router();

router.get("/stats", metaController.stats);

export default router;
