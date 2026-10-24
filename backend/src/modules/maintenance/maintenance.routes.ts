/**
 * Maintenance module routes: /api/maintenance*
 */
import { Router } from "express";
import { maintenanceController } from "./maintenance.controller";
import { maintenanceSchema, maintenanceUpdateSchema } from "./maintenance.validations";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.use(authenticate);
router.get("/", maintenanceController.list);
router.post("/", validate(maintenanceSchema), maintenanceController.create);
router.put("/:id", validate(maintenanceUpdateSchema), maintenanceController.update);

export default router;
