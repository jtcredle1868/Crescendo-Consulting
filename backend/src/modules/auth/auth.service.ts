import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../lib/password";
import { signAccessToken } from "../../lib/jwt";
import { ApiError } from "../../lib/errors";
import type { RegisterInput, LoginInput } from "./auth.schema";

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: input.role,
      isBusiness: input.isBusiness ?? false,
      businessName: input.businessName,
      profile: {
        create: {
          displayName: input.displayName,
        },
      },
    },
    include: { profile: true },
  });

  const token = signAccessToken({ sub: user.id, role: user.role });
  return { token, user };
}

export async function loginUser(input: LoginInput) {
  const email = input.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signAccessToken({ sub: user.id, role: user.role });
  return { token, user };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, include: { profile: true } });
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return user;
}
