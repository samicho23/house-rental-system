/**
 * Auth core: password hashing (scrypt), JWT sessions (HMAC-SHA256).
 * Mirrors the proposal's auth module: the server proves identity and
 * issues/checks the session token. Pure functions - cookie handling lives
 * in the controllers/middleware so this module stays framework-free.
 */
import crypto from "node:crypto";
import {
  createToken,
  sessionCookieOptions,
  verifyToken,
} from "../utils/jwt";
import type { AuthTokenPayload } from "../utils/auth-contract";

export { createToken, sessionCookieOptions, verifyToken };

// ---------------------------------------------------------------------------
// Password hashing (scrypt with random salt)
// ---------------------------------------------------------------------------
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const candidate = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    if (candidate.length !== expected.length) return false;
    return crypto.timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// JWT (HS256) - minimal, dependency-free implementation
// ---------------------------------------------------------------------------
export type JwtPayload = AuthTokenPayload;
