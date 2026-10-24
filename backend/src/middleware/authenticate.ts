/**
 * authenticate - verifies the session cookie, loads the account and attaches
 * req.user. Rejects unauthenticated and suspended accounts.
 */
import { prisma } from "../lib/prisma";
import { verifyToken } from "../lib/auth";
import { SESSION_COOKIE } from "../constants";
import { AppError } from "../errors/AppError";
import { asyncHandler } from "../utils";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) throw new AppError("You must be signed in", 401);

  const payload = verifyToken(token);
  if (!payload) throw new AppError("You must be signed in", 401);

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new AppError("Account not found", 401);
  if (user.status !== "ACTIVE") throw new AppError("Account is suspended", 403);

  req.user = { id: user.id, role: user.role, name: `${user.firstName} ${user.lastName}` };
  next();
});
