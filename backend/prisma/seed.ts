import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const password = await hashPassword("Password123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@crescendo.app" },
    update: {},
    create: {
      email: "admin@crescendo.app",
      passwordHash: password,
      role: "ADMIN",
      verificationStatus: "VERIFIED",
      profile: { create: { displayName: "Crescendo Admin" } },
    },
  });

  const musician = await prisma.user.upsert({
    where: { email: "musician@crescendo.app" },
    update: {},
    create: {
      email: "musician@crescendo.app",
      passwordHash: password,
      role: "MUSICIAN",
      verificationStatus: "VERIFIED",
      profile: {
        create: {
          displayName: "Jordan Reyes",
          headline: "Session guitarist & songwriter",
          bio: "10 years touring and session work. Looking for producers for an EP.",
          city: "Nashville",
          state: "TN",
          country: "US",
          genres: ["Country", "Rock"],
          skills: ["Guitar", "Songwriting", "Vocals"],
          yearsExperience: 10,
          rateMin: 75,
          rateMax: 150,
        },
      },
    },
  });

  const producer = await prisma.user.upsert({
    where: { email: "producer@crescendo.app" },
    update: {},
    create: {
      email: "producer@crescendo.app",
      passwordHash: password,
      role: "PRODUCER",
      isBusiness: true,
      businessName: "Riverbend Productions LLC",
      verificationStatus: "VERIFIED",
      profile: {
        create: {
          displayName: "Riverbend Productions",
          headline: "Full-service production for country & Americana acts",
          city: "Nashville",
          state: "TN",
          country: "US",
          genres: ["Country", "Americana"],
          skills: ["Mixing", "Mastering", "Production"],
          yearsExperience: 15,
          rateMin: 400,
          rateMax: 1200,
          rateUnit: "session",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "technician@crescendo.app" },
    update: {},
    create: {
      email: "technician@crescendo.app",
      passwordHash: password,
      role: "TECHNICIAN",
      verificationStatus: "PENDING",
      profile: {
        create: {
          displayName: "Sam Lee",
          headline: "Live sound engineer",
          city: "Austin",
          state: "TX",
          country: "US",
          skills: ["FOH Mixing", "Stage Monitoring", "PA Setup"],
          yearsExperience: 6,
          rateMin: 50,
          rateMax: 100,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "venue@crescendo.app" },
    update: {},
    create: {
      email: "venue@crescendo.app",
      passwordHash: password,
      role: "VENUE",
      isBusiness: true,
      businessName: "The Blue Room",
      verificationStatus: "VERIFIED",
      profile: {
        create: {
          displayName: "The Blue Room",
          headline: "200-cap listening room in East Nashville",
          city: "Nashville",
          state: "TN",
          country: "US",
          genres: ["Country", "Rock", "Americana"],
          skills: ["Live Sound", "Booking"],
        },
      },
    },
  });

  const spaces = [
    {
      name: "Riverside Coworking",
      address: "100 Riverside Ave, Nashville, TN",
      city: "Nashville",
      state: "TN",
      category: "COWORKING" as const,
      capacity: 8,
      isPartner: true,
      notes: "Bookable meeting rooms at the front desk; mention Crescendo Consulting.",
    },
    {
      name: "Daily Grind Coffee",
      address: "45 Music Row, Nashville, TN",
      city: "Nashville",
      state: "TN",
      category: "CAFE" as const,
      isPartner: false,
      notes: "Open until 9pm, plenty of table seating.",
    },
    {
      name: "East Side Rehearsal Studios",
      address: "212 5th St, Austin, TX",
      city: "Austin",
      state: "TX",
      category: "REHEARSAL_STUDIO" as const,
      capacity: 6,
      isPartner: true,
      notes: "Front lobby is open to the public for meet-ups; hourly rooms available.",
    },
  ];

  for (const space of spaces) {
    await prisma.meetingSpace.upsert({
      where: { id: `seed-${space.name}` },
      update: {},
      create: { id: `seed-${space.name}`, ...space },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seeded:", { admin: admin.email, musician: musician.email, producer: producer.email });
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
