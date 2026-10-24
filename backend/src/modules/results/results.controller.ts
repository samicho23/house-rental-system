/**
 * Results module HTTP layer.
 */
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils";
import { resultsService } from "./results.service";

export const resultsController = {
  /** GET /api/results */
  publicOverview: asyncHandler(async (_req: Request, res: Response) => {
    const result = await resultsService.publicOverview();
    res.status(200).json(result);
  }),

  /** GET /api/admin/results */
  adminOverview: asyncHandler(async (_req: Request, res: Response) => {
    const result = await resultsService.adminOverview();
    res.status(200).json(result);
  }),
};
