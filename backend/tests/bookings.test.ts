import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, resetDb, registerAndLogin } from "./testUtils";

describe("bookings", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("creates a booking request and lets only the provider confirm it", async () => {
    const client = await registerAndLogin({ email: "client-book@crescendo.app", role: "VENUE" });
    const provider = await registerAndLogin({ email: "provider-book@crescendo.app", role: "MUSICIAN" });

    const createRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${client.token}`)
      .send({
        providerId: provider.user.id,
        title: "Friday night set",
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(),
        rate: 500,
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.booking.status).toBe("REQUESTED");
    const bookingId = createRes.body.booking.id;

    const clientConfirm = await request(app)
      .patch(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${client.token}`)
      .send({ status: "CONFIRMED" });
    expect(clientConfirm.status).toBe(403);

    const providerConfirm = await request(app)
      .patch(`/api/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${provider.token}`)
      .send({ status: "CONFIRMED" });
    expect(providerConfirm.status).toBe(200);
    expect(providerConfirm.body.booking.status).toBe("CONFIRMED");

    const mine = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${client.token}`);
    expect(mine.status).toBe(200);
    expect(mine.body.bookings).toHaveLength(1);
  });

  it("rejects bookings where endTime is before startTime", async () => {
    const client = await registerAndLogin({ email: "client-bad@crescendo.app", role: "VENUE" });
    const provider = await registerAndLogin({ email: "provider-bad@crescendo.app", role: "MUSICIAN" });

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${client.token}`)
      .send({
        providerId: provider.user.id,
        title: "Bad booking",
        startTime: new Date(Date.now() + 90000000).toISOString(),
        endTime: new Date(Date.now() + 86400000).toISOString(),
      });
    expect(res.status).toBe(400);
  });
});
