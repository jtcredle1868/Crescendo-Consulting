export type UserRole = "MUSICIAN" | "PRODUCER" | "TECHNICIAN" | "VENUE" | "SERVICE_PROVIDER" | "ADMIN";

export const SELECTABLE_ROLES: { value: Exclude<UserRole, "ADMIN">; label: string; blurb: string }[] = [
  { value: "MUSICIAN", label: "Musician", blurb: "Performer, songwriter, or session player" },
  { value: "PRODUCER", label: "Producer", blurb: "Recording, mixing, or executive production" },
  { value: "TECHNICIAN", label: "Technician", blurb: "Live sound, backline, or studio engineering" },
  { value: "VENUE", label: "Venue", blurb: "A room, club, or space that books talent" },
  { value: "SERVICE_PROVIDER", label: "Service Provider", blurb: "Booking, PR, legal, or other music services" },
];

export function roleLabel(role: UserRole): string {
  return SELECTABLE_ROLES.find((r) => r.value === role)?.label ?? role;
}

export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
