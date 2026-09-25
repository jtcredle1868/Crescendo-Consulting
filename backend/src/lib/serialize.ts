import type { User, Profile } from "@prisma/client";

export type SafeUser = Omit<User, "passwordHash"> & { profile?: Profile | null };

export function toSafeUser(user: User & { profile?: Profile | null }): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
