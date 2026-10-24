/**
 * Server entry point - boots the Express app.
 * Run with bun:    bun run dev      (hot reload)
 * Run with node:   npm run dev:node (tsx watch)
 */
import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const app = createApp();

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log("┌──────────────────────────────────────────────┐");
  console.log("│  FaydaRent backend                           │");
  console.log(`│  listening on http://localhost:${env.port}       │`);
  console.log(`│  env: ${env.nodeEnv.padEnd(40)}│`);
  console.log("└──────────────────────────────────────────────┘");
});

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`\n[${signal}] shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  // force-exit safety net
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
