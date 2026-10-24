/**
 * Verification module HTTP layer.
 */
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils";
import { verificationService } from "./verification.service";

export const verificationController = {
  /** POST /api/verification/fayda */
  verify: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await verificationService.verify(req.body));
  }),

  /** GET /api/verification/status */
  status: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await verificationService.status(req.user!.id));
  }),
};
