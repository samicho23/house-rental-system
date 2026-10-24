/**
 * authorize - role guard used to protect routes. It implies authentication:
 * the session is verified and req.user is attached before the role check.
 * Usage: router.put("/:id", ...requireRole("LANDLORD", "ADMIN"), handler)
 */
import type { RequestHandler } from "express";
import { authenticate } from "./authenticate";
import { AppError } from "../errors/AppError";

export function requireRole(...roles: string[]): RequestHandler[] {
  const checkRole: RequestHandler = (req, _res, next) => {
    if (!req.user) return next(new AppError("You must be signed in", 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to do this", 403));
    }
    next();
  };
  return [authenticate, checkRole];
}
