import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isDev ? ["query", "error"] : ["error"],
    datasources: { db: { url: env.databaseUrl } },
  });

if (env.isDev) globalForPrisma.prisma = prisma;
