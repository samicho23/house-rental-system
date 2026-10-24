/**
 * Auth module routes: /api/auth/*
 */
import { Router } from "express";
import { authController } from "./auth.controller";
import { faydaVerifySchema, registerSchema, loginSchema } from "./auth.validations";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/fayda", validate(faydaVerifySchema), authController.verifyFayda);
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export default router;
