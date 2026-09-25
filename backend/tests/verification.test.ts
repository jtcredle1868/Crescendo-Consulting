import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, resetDb, registerAndLogin } from "./testUtils";

describe("verification", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("queues a manual review request and marks the user PENDING", async () => {
    const { token, user } = await registerAndLogin({ email: "verify@crescendo.app", role: "PRODUCER" });
    expect(user.verificationStatus).toBe("UNVERIFIED");

    const res = await request(app)
      .post("/api/verification/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({
        documents: [{ type: "GOVERNMENT_ID", fileUrl: "https://example.com/id.png" }],
      });

    expect(res.status).toBe(201);
    expect(res.body.request.status).toBe("PENDING");
    expect(res.body.request.provider).toBe("MANUAL");

    const me = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(me.body.user.verificationStatus).toBe("PENDING");
  });

  it("lets an admin approve a pending request", async () => {
    const { token } = await registerAndLogin({ email: "approve-me@crescendo.app", role: "VENUE" });
    await request(app)
      .post("/api/verification/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ documents: [{ type: "BUSINESS_LICENSE", fileUrl: "https://example.com/license.pdf" }] });

    await registerAndLogin({
      email: "admin-reviewer@crescendo.app",
      role: "MUSICIAN",
    });
    // Promote to admin directly for the test (no public self-serve admin signup).
    const { prisma } = await import("../src/lib/prisma");
    await prisma.user.update({
      where: { email: "admin-reviewer@crescendo.app" },
      data: { role: "ADMIN" },
    });
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin-reviewer@crescendo.app", password: "Password123!" });

    const pendingRes = await request(app)
      .get("/api/admin/verification/requests")
      .set("Authorization", `Bearer ${adminLogin.body.token}`);
    expect(pendingRes.status).toBe(200);
    expect(pendingRes.body.requests).toHaveLength(1);

    const requestId = pendingRes.body.requests[0].id;
    const decision = await request(app)
      .post(`/api/admin/verification/requests/${requestId}/decision`)
      .set("Authorization", `Bearer ${adminLogin.body.token}`)
      .send({ status: "VERIFIED", notes: "Docs check out" });

    expect(decision.status).toBe(200);
    expect(decision.body.request.status).toBe("VERIFIED");
  });

  it("blocks non-admins from the review queue", async () => {
    const { token } = await registerAndLogin({ email: "not-admin@crescendo.app" });
    const res = await request(app)
      .get("/api/admin/verification/requests")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
