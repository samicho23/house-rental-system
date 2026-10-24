/**
 * Central error handling: converts AppError, ZodError and unknown failures
 * into the uniform JSON envelope { error, details? }.
 */
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }

  if (err instanceof ZodError) {
    const issue = err.issues[0];
    return res.status(400).json({ error: issue?.message ?? "Invalid request body" });
  }

  // Malformed JSON bodies from express.json()
  if (err instanceof SyntaxError && "body" in (err as object)) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  console.error("[api]", err);
  const message = err instanceof Error ? err.message : "Unexpected server error";
  return res.status(500).json({ error: env.isDev ? message : "Unexpected server error" });
}
