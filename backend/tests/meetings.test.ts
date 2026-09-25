import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, resetDb, registerAndLogin } from "./testUtils";
import { prisma } from "../src/lib/prisma";

async function acceptedConnection() {
  const a = await registerAndLogin({ email: "a-meet@crescendo.app", role: "MUSICIAN" });
  const b = await registerAndLogin({ email: "b-meet@crescendo.app", role: "PRODUCER" });

  const createRes = await request(app)
    .post("/api/connections")
    .set("Authorization", `Bearer ${a.token}`)
    .send({ recipientId: b.user.id });

  await request(app)
    .patch(`/api/connections/${createRes.body.connection.id}`)
    .set("Authorization", `Bearer ${b.token}`)
    .send({ status: "ACCEPTED" });

  return { a, b, connectionId: createRes.body.connection.id as string };
}

describe("neutral meeting spaces and meeting proposals", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("lists meeting spaces, optionally filtered by city", async () => {
    await prisma.meetingSpace.create({
      data: {
        name: "Test Coworking",
        address: "1 Main St",
        city: "Nashville",
        category: "COWORKING",
        isPartner: true,
      },
    });
    await prisma.meetingSpace.create({
      data: {
        name: "Other City Cafe",
        address: "2 Main St",
        city: "Austin",
        category: "CAFE",
      },
    });

    const res = await request(app).get("/api/meeting-spaces").query({ city: "Nashville" });
    expect(res.status).toBe(200);
    expect(res.body.spaces).toHaveLength(1);
    expect(res.body.spaces[0].name).toBe("Test Coworking");
  });

  it("only lets ACCEPTED connections propose a meeting, and requires the other party to accept", async () => {
    const { a, b, connectionId } = await acceptedConnection();
    const space = await prisma.meetingSpace.create({
      data: { name: "Neutral Spot", address: "3 Main St", city: "Nashville", category: "CAFE" },
    });

    const proposeRes = await request(app)
      .post("/api/meetings")
      .set("Authorization", `Bearer ${a.token}`)
      .send({
        connectionId,
        meetingSpaceId: space.id,
        proposedTime: new Date(Date.now() + 86400000).toISOString(),
        notes: "Coffee to discuss the EP",
      });
    expect(proposeRes.status).toBe(201);
    expect(proposeRes.body.meeting.status).toBe("PROPOSED");
    const meetingId = proposeRes.body.meeting.id;

    // The proposer cannot accept their own proposal.
    const selfAccept = await request(app)
      .patch(`/api/meetings/${meetingId}`)
      .set("Authorization", `Bearer ${a.token}`)
      .send({ status: "ACCEPTED" });
    expect(selfAccept.status).toBe(403);

    const otherAccept = await request(app)
      .patch(`/api/meetings/${meetingId}`)
      .set("Authorization", `Bearer ${b.token}`)
      .send({ status: "ACCEPTED" });
    expect(otherAccept.status).toBe(200);
    expect(otherAccept.body.meeting.status).toBe("ACCEPTED");
  });

  it("rejects proposals for connections that are not yet accepted", async () => {
    const a = await registerAndLogin({ email: "pending-a@crescendo.app" });
    const b = await registerAndLogin({ email: "pending-b@crescendo.app", role: "PRODUCER" });
    const createRes = await request(app)
      .post("/api/connections")
      .set("Authorization", `Bearer ${a.token}`)
      .send({ recipientId: b.user.id });

    const space = await prisma.meetingSpace.create({
      data: { name: "Too Soon Cafe", address: "4 Main St", city: "Nashville", category: "CAFE" },
    });

    const res = await request(app)
      .post("/api/meetings")
      .set("Authorization", `Bearer ${a.token}`)
      .send({
        connectionId: createRes.body.connection.id,
        meetingSpaceId: space.id,
        proposedTime: new Date(Date.now() + 86400000).toISOString(),
      });
    expect(res.status).toBe(403);
  });
});
