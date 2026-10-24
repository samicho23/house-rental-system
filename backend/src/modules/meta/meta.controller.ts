/**
 * Meta (public) module HTTP layer.
 */
import type { Request, Response } from "express";
import { metaService } from "./meta.service";
import { asyncHandler } from "../../utils";

export const metaController = {
  /** GET /api/public/stats - landing page numbers (no auth required) */
  stats: asyncHandler(async (_req: Request, res: Response) => {
    const result = await metaService.publicStats();
    res.status(200).json(result);
  }),
};
