import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, resetDb, registerAndLogin } from "./testUtils";

describe("connections and messages", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("supports request -> accept -> message flow", async () => {
    const musician = await registerAndLogin({ email: "musician2@crescendo.app", role: "MUSICIAN" });
    const producer = await registerAndLogin({ email: "producer2@crescendo.app", role: "PRODUCER" });

    const createRes = await request(app)
      .post("/api/connections")
      .set("Authorization", `Bearer ${musician.token}`)
      .send({ recipientId: producer.user.id, message: "Would love to work together" });
    expect(createRes.status).toBe(201);
    const connectionId = createRes.body.connection.id;
    expect(createRes.body.connection.status).toBe("PENDING");

    const dupe = await request(app)
      .post("/api/connections")
      .set("Authorization", `Bearer ${musician.token}`)
      .send({ recipientId: producer.user.id });
    expect(dupe.status).toBe(409);

    const blockedMessage = await request(app)
      .post(`/api/connections/${connectionId}/messages`)
      .set("Authorization", `Bearer ${musician.token}`)
      .send({ body: "Hi!" });
    expect(blockedMessage.status).toBe(403);

    const acceptRes = await request(app)
      .patch(`/api/connections/${connectionId}`)
      .set("Authorization", `Bearer ${producer.token}`)
      .send({ status: "ACCEPTED" });
    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.connection.status).toBe("ACCEPTED");

    const msgRes = await request(app)
      .post(`/api/connections/${connectionId}/messages`)
      .set("Authorization", `Bearer ${musician.token}`)
      .send({ body: "Excited to collaborate!" });
    expect(msgRes.status).toBe(201);

    const listRes = await request(app)
      .get(`/api/connections/${connectionId}/messages`)
      .set("Authorization", `Bearer ${producer.token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.messages).toHaveLength(1);
    expect(listRes.body.messages[0].body).toBe("Excited to collaborate!");
  });

  it("only the recipient can accept or decline a connection", async () => {
    const musician = await registerAndLogin({ email: "musician3@crescendo.app" });
    const producer = await registerAndLogin({ email: "producer3@crescendo.app", role: "PRODUCER" });

    const createRes = await request(app)
      .post("/api/connections")
      .set("Authorization", `Bearer ${musician.token}`)
      .send({ recipientId: producer.user.id });

    const res = await request(app)
      .patch(`/api/connections/${createRes.body.connection.id}`)
      .set("Authorization", `Bearer ${musician.token}`)
      .send({ status: "ACCEPTED" });
    expect(res.status).toBe(403);
  });
});
