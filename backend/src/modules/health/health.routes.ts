/**
 * Health module - liveness/readiness probe with a database ping.
 */
import type { Request, Response } from "express";
import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { asyncHandler } from "../../utils";

const startedAt = Date.now();

export const healthController = {
  /** GET /api/health */
  check: asyncHandler(async (_req: Request, res: Response) => {
    let database = "up";
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      database = "down";
    }
    res.status(200).json({
      status: "ok",
      service: "faydarent-backend",
      database,
      env: env.nodeEnv,
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    });
  }),
};

const router = Router();
router.get("/", healthController.check);

export default router;
