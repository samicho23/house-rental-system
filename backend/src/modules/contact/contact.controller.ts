/**
 * Contact module HTTP layer.
 */
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils";
import { contactService } from "./contact.service";

export const contactController = {
  /** POST /api/contact */
  submit: asyncHandler(async (req: Request, res: Response) => {
    const result = await contactService.submit(req.body);
    res.status(201).json(result);
  }),
};
