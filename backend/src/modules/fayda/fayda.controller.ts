/**
 * Fayda verification HTTP layer.
 */
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils";
import { faydaService } from "./fayda.service";

export const faydaController = {
  /** POST /api/fayda/verify */
  verify: asyncHandler(async (req: Request, res: Response) => {
    const result = await faydaService.verify(req.body.fin);
    res.status(200).json(result);
  }),
};
