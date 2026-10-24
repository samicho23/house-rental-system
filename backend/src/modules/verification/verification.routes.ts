/**
 * Verification routes: /api/verification/*
 */
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { verificationController } from "./verification.controller";
import { verificationRequestSchema } from "./verification.validations";

const router = Router();

router.post("/fayda", validate(verificationRequestSchema), verificationController.verify);
router.get("/status", authenticate, verificationController.status);

export default router;
