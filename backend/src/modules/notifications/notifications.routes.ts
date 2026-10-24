/**
 * Notifications module routes: /api/notifications*
 */
import { Router } from "express";
import { notificationsController } from "./notifications.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.use(authenticate);
router.get("/", notificationsController.list);
router.put("/read", notificationsController.markRead);

export default router;
