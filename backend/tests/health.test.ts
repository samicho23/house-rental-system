/**
 * Health endpoint smoke test.
 * Run: cd backend && bun test
 * The test boots the app in-process (no external server needed).
 */
import { describe, expect, test, afterAll } from "bun:test";

// env for the test run: isolated in-memory style path is not supported by
// prisma sqlite migrations here, so we point at the real dev database file
// but only touch read-only endpoints.
process.env.PORT = "3999";
process.env.NODE_ENV = "test";

const { createApp } = await import("../src/app");

const app = createApp();
const server = app.listen(3999);
const base = "http://localhost:3999";

describe("GET /api/health", () => {
  test("returns ok with service metadata", async () => {
    const res = await fetch(`${base}/api/health`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.status).toBe("ok");
    expect(body.service).toBe("faydarent-backend");
    expect(typeof body.uptimeSeconds).toBe("number");
  });

  test("public stats exposes landing counters", async () => {
    const res = await fetch(`${base}/api/public/stats`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(Array.isArray(body.cities)).toBe(true);
  });

  test("unknown route returns 404 envelope", async () => {
    const res = await fetch(`${base}/api/definitely-not-a-route`);
    expect(res.status).toBe(404);
    const body = (await res.json()) as any;
    expect(typeof body.error).toBe("string");
  });
});

afterAll(() => server.close());
