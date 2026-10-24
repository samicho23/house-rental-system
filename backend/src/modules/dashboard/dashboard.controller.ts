/**
 * Dashboard module HTTP layer.
 */
import type { Request, Response } from "express";
import { dashboardService } from "./dashboard.service";
import { asyncHandler } from "../../utils";

export const dashboardController = {
  /** GET /api/dashboard */
  get: asyncHandler(async (req: Request, res: Response) => {
    const result = await dashboardService.get(req.user!);
    res.status(200).json(result);
  }),
};
