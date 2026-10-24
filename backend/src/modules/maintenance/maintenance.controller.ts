/**
 * Maintenance module HTTP layer.
 */
import type { Request, Response } from "express";
import { maintenanceService } from "./maintenance.service";
import { asyncHandler, parseId } from "../../utils";

export const maintenanceController = {
  /** GET /api/maintenance */
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await maintenanceService.list(req.user!);
    res.status(200).json(result);
  }),

  /** POST /api/maintenance */
  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await maintenanceService.create(req.user!, req.body);
    res.status(201).json(result);
  }),

  /** PUT /api/maintenance/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const result = await maintenanceService.update(parseId(req.params.id), req.user!, req.body);
    res.status(200).json(result);
  }),
};
