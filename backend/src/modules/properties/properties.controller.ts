/**
 * Properties module HTTP layer.
 */
import type { Request, Response } from "express";
import { propertiesService } from "./properties.service";
import { asyncHandler, parseId } from "../../utils";

export const propertiesController = {
  /** GET /api/properties */
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await propertiesService.search(req.query as Record<string, string>);
    res.status(200).json(result);
  }),

  /** POST /api/properties */
  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await propertiesService.create(req.user!, req.body);
    res.status(201).json(result);
  }),

  /** GET /api/properties/:id */
  detail: asyncHandler(async (req: Request, res: Response) => {
    const result = await propertiesService.detail(parseId(req.params.id));
    res.status(200).json(result);
  }),

  /** PUT /api/properties/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const result = await propertiesService.update(parseId(req.params.id), req.user!, req.body);
    res.status(200).json(result);
  }),

  /** DELETE /api/properties/:id */
  remove: asyncHandler(async (req: Request, res: Response) => {
    const result = await propertiesService.remove(parseId(req.params.id), req.user!);
    res.status(200).json(result);
  }),
};
