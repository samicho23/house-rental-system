/**
 * Auth flow test: Fayda verification shape, login guard and role guard.
 * Uses the seeded demo database.
 */
import { describe, expect, test, afterAll } from "bun:test";

process.env.PORT = "3998";
process.env.NODE_ENV = "test";

const { createApp } = await import("../src/app");

const app = createApp();
const server = app.listen(3998);
const base = "http://localhost:3998";

describe("auth flow", () => {
  test("fayda verify returns deterministic claims", async () => {
    const res = await fetch(`${base}/api/auth/fayda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fin: "XY9876543", consent: true }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.claims.fin).toBe("XY9876543");
    expect(body.claims.phone).toMatch(/^\+2519/);
  });

  test("fayda verify rejects missing consent", async () => {
    const res = await fetch(`${base}/api/auth/fayda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fin: "XY9876543", consent: false }),
    });
    expect(res.status).toBe(400);
  });

  test("login sets an httpOnly session cookie", async () => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "samuel@rental.et", password: "Tenant@123" }),
    });
    expect(res.status).toBe(200);
    const cookie = res.headers.get("set-cookie");
    expect(cookie).toContain("hrs_session=");
    expect(cookie).toContain("HttpOnly");
  });

  test("protected route rejects anonymous access", async () => {
    const res = await fetch(`${base}/api/dashboard`);
    expect(res.status).toBe(401);
    expect(((await res.json()) as any).error).toBe("You must be signed in");
  });

  test("role guard blocks tenants from admin reports", async () => {
    const login = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "samuel@rental.et", password: "Tenant@123" }),
    });
    const cookie = login.headers.get("set-cookie")!.split(";")[0];

    const res = await fetch(`${base}/api/admin/reports`, { headers: { cookie } });
    expect(res.status).toBe(403);
  });
});

afterAll(() => server.close());
