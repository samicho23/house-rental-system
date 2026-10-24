/**
 * Applications module HTTP layer.
 */
import type { Request, Response } from "express";
import { applicationsService } from "./applications.service";
import { asyncHandler, parseId } from "../../utils";

export const applicationsController = {
  /** GET /api/applications */
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await applicationsService.list(req.user!);
    res.status(200).json(result);
  }),

  /** POST /api/applications */
  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await applicationsService.create(req.user!, req.body);
    res.status(201).json(result);
  }),

  /** PUT /api/applications/:id */
  decide: asyncHandler(async (req: Request, res: Response) => {
    const result = await applicationsService.decide(parseId(req.params.id), req.user!, req.body);
    res.status(200).json(result);
  }),
};
