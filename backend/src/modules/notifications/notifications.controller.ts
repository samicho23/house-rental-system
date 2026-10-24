/**
 * Notifications module HTTP layer.
 */
import type { Request, Response } from "express";
import { notificationsService } from "./notifications.service";
import { asyncHandler } from "../../utils";

export const notificationsController = {
  /** GET /api/notifications */
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationsService.list(req.user!.id);
    res.status(200).json(result);
  }),

  /** PUT /api/notifications/read */
  markRead: asyncHandler(async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as { id?: string };
    const result = await notificationsService.markRead(req.user!.id, body.id);
    res.status(200).json(result);
  }),
};
