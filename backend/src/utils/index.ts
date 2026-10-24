/**
 * Small shared helpers used by controllers and services.
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../errors/AppError";
import type { SessionUser } from "../types/session";

/** Wrap an async route handler so rejections reach the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/** Validate a path parameter id (Express 5 types may be string | string[]). */
export function parseId(id: string | string[] | undefined): string {
  const value = Array.isArray(id) ? id[0] : id;
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new AppError("Invalid identifier", 400);
  }
  return value;
}

/** Ownership check helper for landlords/admins. */
export function assertOwnership(resourceOwnerId: string, user: SessionUser) {
  if (user.role === "ADMIN") return;
  if (resourceOwnerId !== user.id) {
    throw new AppError("You can only access your own records", 403);
  }
}

/** Safe number parse for query parameters. */
export function toNumber(value: string | undefined | null): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
