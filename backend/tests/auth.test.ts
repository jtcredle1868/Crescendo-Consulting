import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, resetDb, registerAndLogin } from "./testUtils";

describe("auth", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "new@musician.com",
      password: "Password123!",
      role: "MUSICIAN",
      displayName: "New Musician",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTypeOf("string");
    expect(res.body.user.email).toBe("new@musician.com");
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.user.profile.displayName).toBe("New Musician");
  });

  it("rejects duplicate emails", async () => {
    await registerAndLogin({ email: "dupe@crescendo.app" });
    const res = await request(app).post("/api/auth/register").send({
      email: "dupe@crescendo.app",
      password: "Password123!",
      role: "MUSICIAN",
      displayName: "Dupe",
    });
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials and rejects wrong password", async () => {
    await registerAndLogin({ email: "login@crescendo.app", password: "Password123!" });

    const good = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@crescendo.app", password: "Password123!" });
    expect(good.status).toBe(200);

    const bad = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@crescendo.app", password: "wrong-password" });
    expect(bad.status).toBe(401);
  });

  it("returns the current user for /me with a valid token", async () => {
    const { token, user } = await registerAndLogin({ email: "me@crescendo.app" });
    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(user.id);
  });

  it("rejects /me without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
