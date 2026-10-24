/**
 * Contact module routes: /api/contact
 */
import { Router } from "express";
import { validate } from "../../middleware/validate";
import { contactController } from "./contact.controller";
import { contactMessageSchema } from "./contact.validations";

const router = Router();

router.post("/", validate(contactMessageSchema), contactController.submit);

export default router;
