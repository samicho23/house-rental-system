/**
 * Centralised environment configuration.
 *
 * The backend owns its own .env file (service-local configuration). It is
 * loaded explicitly with override semantics so a DATABASE_URL exported by a
 * parent process (CI wrapper, IDE, sandbox shell) can never point this
 * service at a foreign database. Set shell variables BEFORE calling the
 * process if you need to bypass this (delete the line from .env instead).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// -- .env loading (backend/.env, next to package.json) ------------------------
try {
  const envPath = fileURLToPath(new URL("../../.env", import.meta.url));
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (value !== "") process.env[m[1]] = value;
  }
} catch {
  // no .env file present - rely on real environment variables
}

export const env = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: (process.env.NODE_ENV || "development") !== "production",
  jwtSecret: process.env.JWT_SECRET || "rental-system-dev-secret-change-in-production",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  databaseUrl: process.env.DATABASE_URL || "file:../db/custom.db",
} as const;
