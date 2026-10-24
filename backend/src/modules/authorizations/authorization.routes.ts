/**
 * Authorization routes: /api/authorizations/*
 */
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorizationController } from "./authorization.controller";

const router = Router();

router.get("/me", authenticate, authorizationController.me);

export default router;
