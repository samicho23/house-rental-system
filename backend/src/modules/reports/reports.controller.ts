/**
 * Reports (admin) module HTTP layer.
 */
import type { Request, Response } from "express";
import { reportsService } from "./reports.service";
import { asyncHandler } from "../../utils";

export const reportsController = {
  /** GET /api/admin/reports */
  get: asyncHandler(async (_req: Request, res: Response) => {
    const result = await reportsService.get();
    res.status(200).json(result);
  }),
};
