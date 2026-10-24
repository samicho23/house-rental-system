/**
 * Applications module routes: /api/applications*
 */
import { Router } from "express";
import { applicationsController } from "./applications.controller";
import { applicationSchema, applicationDecisionSchema } from "./applications.validations";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.use(authenticate);
router.get("/", applicationsController.list);
router.post("/", validate(applicationSchema), applicationsController.create);
router.put("/:id", validate(applicationDecisionSchema), applicationsController.decide);

export default router;
