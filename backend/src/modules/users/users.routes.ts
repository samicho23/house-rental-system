/**
 * Users (admin) module routes: /api/admin/users
 */
import { Router } from "express";
import { usersController } from "./users.controller";
import { adminUserActionSchema } from "./users.validations";
import { validate } from "../../middleware/validate";
import { requireRole } from "../../middleware/authorize";

const router = Router();

router.get("/", ...requireRole("ADMIN"), usersController.list);
router.put("/", ...requireRole("ADMIN"), validate(adminUserActionSchema), usersController.updateAction);

export default router;
