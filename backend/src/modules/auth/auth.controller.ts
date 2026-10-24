/**
 * Auth module HTTP layer: request -> service -> response.
 * Cookie writing (the session transport) happens here.
 */
import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "../../constants";
import { sessionCookieOptions } from "../../lib/auth";
import { asyncHandler } from "../../utils";

export const authController = {
  /** POST /api/auth/fayda */
  verifyFayda: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyFayda(req.body);
    res.status(200).json(result);
  }),

  /** POST /api/auth/register */
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.cookie(SESSION_COOKIE, result.token, sessionCookieOptions);
    res.status(201).json(result);
  }),

  /** POST /api/auth/login */
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.cookie(SESSION_COOKIE, result.token, sessionCookieOptions);
    res.status(200).json(result);
  }),

  /** POST /api/auth/logout */
  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(SESSION_COOKIE, { path: "/" });
    res.status(200).json({ success: true });
  }),

  /** GET /api/auth/me */
  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.id);
    res.status(200).json({ user });
  }),
};
