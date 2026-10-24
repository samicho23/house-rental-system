/**
 * Authorization module HTTP layer.
 */
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils";
import { authorizationService } from "./authorization.service";

export const authorizationController = {
  /** GET /api/authorizations/me */
  me: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await authorizationService.getForUser(req.user!.id));
  }),
};
