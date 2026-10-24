/**
 * Leases module HTTP layer.
 */
import type { Request, Response } from "express";
import { leasesService } from "./leases.service";
import { asyncHandler, parseId } from "../../utils";

export const leasesController = {
  /** GET /api/leases */
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await leasesService.list(req.user!, req.query as Record<string, string>);
    res.status(200).json(result);
  }),

  /** GET /api/leases/:id */
  detail: asyncHandler(async (req: Request, res: Response) => {
    const result = await leasesService.detail(parseId(req.params.id), req.user!);
    res.status(200).json(result);
  }),

  /** PUT /api/leases/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const result = await leasesService.update(parseId(req.params.id), req.user!, req.body);
    res.status(200).json(result);
  }),
};
