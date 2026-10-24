/**
 * Express request augmentation - attaches the authenticated session user.
 */
import type { SessionUser } from "./session";

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export {};
