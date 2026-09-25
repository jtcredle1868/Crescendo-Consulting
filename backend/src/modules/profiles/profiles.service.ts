import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/errors";
import type { UpdateProfileInput, SearchProfilesInput } from "./profiles.schema";

export async function getPublicProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  if (!user || !user.profile) {
    throw ApiError.notFound("Profile not found");
  }
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

export async function updateMyProfile(userId: string, input: UpdateProfileInput) {
  const profile = await prisma.profile.update({
    where: { userId },
    data: input,
  });
  return profile;
}

export async function searchProfiles(filters: SearchProfilesInput) {
  const where: Prisma.UserWhereInput = {
    role: filters.role,
    profile: { isNot: null },
  };

  if (filters.verifiedOnly) {
    where.verificationStatus = "VERIFIED";
  }

  const profileConditions: Prisma.ProfileWhereInput = {};
  if (filters.city) {
    profileConditions.city = { equals: filters.city, mode: "insensitive" };
  }
  if (filters.genre) {
    profileConditions.genres = { has: filters.genre };
  }
  if (filters.skill) {
    profileConditions.skills = { has: filters.skill };
  }
  if (filters.q) {
    profileConditions.OR = [
      { displayName: { contains: filters.q, mode: "insensitive" } },
      { headline: { contains: filters.q, mode: "insensitive" } },
      { bio: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (Object.keys(profileConditions).length > 0) {
    where.profile = { is: profileConditions };
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      include: { profile: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    results: users.map(({ passwordHash: _passwordHash, ...safe }) => safe),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
