/**
 * Audit module HTTP layer.
 */
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils";
import { auditService } from "./audit.service";

const firstQueryValue = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const positiveInteger = (value: unknown, fallback: number, maximum: number): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
};

export const auditController = {
  /** GET /api/admin/audit */
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await auditService.list({
      action: firstQueryValue(req.query.action),
      entity: firstQueryValue(req.query.entity),
      actorId: firstQueryValue(req.query.actorId),
      page: positiveInteger(req.query.page, 1, 10_000),
      pageSize: positiveInteger(req.query.pageSize, 25, 100),
    });
    res.status(200).json(result);
  }),
};
