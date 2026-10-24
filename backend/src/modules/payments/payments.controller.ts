/**
 * Payments module HTTP layer.
 */
import type { Request, Response } from "express";
import { paymentsService } from "./payments.service";
import { asyncHandler, parseId } from "../../utils";

export const paymentsController = {
  /** GET /api/payments */
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentsService.list(req.user!, req.query as Record<string, string>);
    res.status(200).json(result);
  }),

  /** POST /api/payments */
  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentsService.create(req.user!, req.body);
    res.status(201).json(result);
  }),

  /** PUT /api/payments/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentsService.update(parseId(req.params.id), req.user!, req.body);
    res.status(200).json(result);
  }),
};
