/**
 * Payments module routes: /api/payments*
 */
import { Router } from "express";
import { paymentsController } from "./payments.controller";
import { paymentSchema, paymentActionSchema } from "./payments.validations";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { requireRole } from "../../middleware/authorize";

const router = Router();

router.get("/", authenticate, paymentsController.list);
router.post(
  "/",
  ...requireRole("LANDLORD", "ADMIN"),
  validate(paymentSchema),
  paymentsController.create
);
router.put(
  "/:id",
  ...requireRole("LANDLORD", "ADMIN"),
  validate(paymentActionSchema),
  paymentsController.update
);

export default router;
