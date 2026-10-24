/**
 * News module HTTP layer.
 */
import type { Request, Response } from "express";
import { asyncHandler, parseId } from "../../utils";
import { newsService } from "./news.service";

export const newsController = {
  /** GET /api/news */
  listPublished: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ news: await newsService.listPublished() });
  }),

  /** GET /api/news/:slug */
  getPublished: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await newsService.getPublished(parseId(req.params.slug)));
  }),

  /** GET /api/admin/news */
  listAll: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ news: await newsService.listAll() });
  }),

  /** POST /api/admin/news */
  create: asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await newsService.create(req.body, req.user!.id));
  }),

  /** PUT /api/admin/news/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await newsService.update(parseId(req.params.id), req.body));
  }),

  /** DELETE /api/admin/news/:id */
  remove: asyncHandler(async (req: Request, res: Response) => {
    await newsService.remove(parseId(req.params.id));
    res.status(204).send();
  }),
};
