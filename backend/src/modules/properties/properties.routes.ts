/**
 * Properties module routes: /api/properties*
 */
import { Router } from "express";
import { propertiesController } from "./properties.controller";
import { propertySchema, propertyUpdateSchema } from "./properties.validations";
import { validate } from "../../middleware/validate";
import { requireRole } from "../../middleware/authorize";
import galleryRoutes from "../gallery/gallery.routes";

const router = Router();

router.use("/:propertyId/gallery", galleryRoutes);
router.get("/", propertiesController.list);
router.post(
  "/",
  ...requireRole("LANDLORD"),
  validate(propertySchema),
  propertiesController.create
);
router.get("/:id", propertiesController.detail);
router.put(
  "/:id",
  ...requireRole("LANDLORD", "ADMIN"),
  validate(propertyUpdateSchema),
  propertiesController.update
);
router.delete("/:id", ...requireRole("LANDLORD", "ADMIN"), propertiesController.remove);

export default router;
