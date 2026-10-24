/**
 * Public news routes: /api/news
 */
import { Router } from "express";
import { newsController } from "./news.controller";

const router = Router();

router.get("/", newsController.listPublished);
router.get("/:slug", newsController.getPublished);

export default router;
