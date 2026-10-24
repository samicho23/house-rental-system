/**
 * Users (admin) module HTTP layer.
 */
import type { Request, Response } from "express";
import { usersService } from "./users.service";
import { asyncHandler } from "../../utils";

export const usersController = {
  /** GET /api/admin/users */
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await usersService.list(req.query as Record<string, string>);
    res.status(200).json(result);
  }),

  /** PUT /api/admin/users */
  updateAction: asyncHandler(async (req: Request, res: Response) => {
    const result = await usersService.updateAction(req.user!, req.body);
    res.status(200).json(result);
  }),
};
