/**
 * Application error type - thrown by services/controllers and converted to a
 * JSON response by the central error handler. Keeps route code free of
 * try/catch noise.
 */
export class AppError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

/** Commonly used constructor helpers. */
export const badRequest = (msg = "Invalid request", details?: unknown) =>
  new AppError(msg, 400, details);
export const unauthorized = (msg = "You must be signed in") => new AppError(msg, 401);
export const forbidden = (msg = "You do not have permission to do this") => new AppError(msg, 403);
export const notFound = (msg = "Resource not found") => new AppError(msg, 404);
export const conflict = (msg = "Conflict") => new AppError(msg, 409);
