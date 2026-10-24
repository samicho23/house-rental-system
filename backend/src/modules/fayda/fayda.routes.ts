/**
 * Fayda identity verification routes: /api/fayda/*
 */
import { Router } from "express";
import { validate } from "../../middleware/validate";
import { faydaVerifySchema } from "../auth/auth.validations";
import { faydaController } from "./fayda.controller";

const router = Router();

router.post("/verify", validate(faydaVerifySchema), faydaController.verify);

export default router;
