/**
 * Property gallery routes: /api/properties/:propertyId/gallery
 */
import { Router } from "express";
import { requireRole } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { galleryController } from "./gallery.controller";
import { galleryPhotoSchema, galleryReorderSchema } from "./gallery.validations";

const router = Router({ mergeParams: true });

router.get("/", galleryController.list);
router.post("/", ...requireRole("LANDLORD", "ADMIN"), validate(galleryPhotoSchema), galleryController.add);
router.put("/reorder", ...requireRole("LANDLORD", "ADMIN"), validate(galleryReorderSchema), galleryController.reorder);
router.delete("/:photoId", ...requireRole("LANDLORD", "ADMIN"), galleryController.remove);

export default router;
