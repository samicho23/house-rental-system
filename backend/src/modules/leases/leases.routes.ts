/**
 * Leases module routes: /api/leases*
 */
import { Router } from "express";
import { leasesController } from "./leases.controller";
import { leaseUpdateSchema } from "./leases.validations";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.use(authenticate);
router.get("/", leasesController.list);
router.get("/:id", leasesController.detail);
router.put("/:id", validate(leaseUpdateSchema), leasesController.update);

export default router;
