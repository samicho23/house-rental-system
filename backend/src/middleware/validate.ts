/**
 * validate - Zod body validation middleware. The parsed (and coerced) value
 * replaces req.body so controllers always work with clean data.
 */
import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/AppError";

export const validate =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issue = result.error.issues[0];
      return next(new AppError(issue?.message ?? "Invalid request body", 400));
    }
    req.body = result.data;
    next();
  };
