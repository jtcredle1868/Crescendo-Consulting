import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

export const app = createApp();

export async function resetDb() {
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.meetingProposal.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.connection.deleteMany(),
    prisma.verificationDocument.deleteMany(),
    prisma.verificationRequest.deleteMany(),
    prisma.meetingSpace.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

interface RegisterOptions {
  email: string;
  password?: string;
  role?: "MUSICIAN" | "PRODUCER" | "TECHNICIAN" | "VENUE" | "SERVICE_PROVIDER";
  displayName?: string;
}

export async function registerAndLogin(options: RegisterOptions) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      email: options.email,
      password: options.password ?? "Password123!",
      role: options.role ?? "MUSICIAN",
      displayName: options.displayName ?? "Test User",
    });

  if (res.status !== 201) {
    throw new Error(`Registration failed: ${JSON.stringify(res.body)}`);
  }

  return { token: res.body.token as string, user: res.body.user };
}
