/**
 * Administrator news routes: /api/admin/news
 */
import { Router } from "express";
import { requireRole } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { newsController } from "./news.controller";
import { newsArticleSchema, updateNewsArticleSchema } from "./news.validations";

const router = Router();

router.get("/", ...requireRole("ADMIN"), newsController.listAll);
router.post("/", ...requireRole("ADMIN"), validate(newsArticleSchema), newsController.create);
router.put("/:id", ...requireRole("ADMIN"), validate(updateNewsArticleSchema), newsController.update);
router.delete("/:id", ...requireRole("ADMIN"), newsController.remove);

export default router;
