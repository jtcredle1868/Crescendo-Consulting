import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/errors";
import { env } from "../../config/env";
import { ManualReviewProvider } from "./providers/ManualReviewProvider";
import { IdMeProvider } from "./providers/IdMeProvider";
import type { VerificationProvider } from "./providers/VerificationProvider";
import type { SubmitVerificationInput, ReviewDecisionInput } from "./verification.schema";

const manualProvider = new ManualReviewProvider();
const idmeProvider = new IdMeProvider();

function selectProvider(): VerificationProvider {
  return env.verificationProvider === "IDME" ? idmeProvider : manualProvider;
}

export async function submitVerification(userId: string, input: SubmitVerificationInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");

  const provider = selectProvider();
  let outcome;
  try {
    outcome = await provider.submit({
      userId,
      isBusiness: user.isBusiness,
      businessName: user.businessName,
      documentUrls: input.documents,
    });
  } catch {
    // Fail closed into the manual queue rather than blocking the user.
    outcome = await manualProvider.submit({
      userId,
      isBusiness: user.isBusiness,
      businessName: user.businessName,
      documentUrls: input.documents,
    });
  }

  const request = await prisma.$transaction(async (tx) => {
    const created = await tx.verificationRequest.create({
      data: {
        userId,
        provider: provider.type,
        status: outcome.status,
        notes: input.notes ?? outcome.notes,
        documents: {
          create: input.documents.map((doc) => ({ type: doc.type, fileUrl: doc.fileUrl })),
        },
      },
      include: { documents: true },
    });

    await tx.user.update({
      where: { id: userId },
      data: { verificationStatus: outcome.status },
    });

    return created;
  });

  return request;
}

export async function listMyVerificationRequests(userId: string) {
  return prisma.verificationRequest.findMany({
    where: { userId },
    include: { documents: true },
    orderBy: { submittedAt: "desc" },
  });
}

export async function listPendingVerificationRequests() {
  return prisma.verificationRequest.findMany({
    where: { status: "PENDING" },
    include: { documents: true, user: { include: { profile: true } } },
    orderBy: { submittedAt: "asc" },
  });
}

export async function decideVerificationRequest(
  requestId: string,
  reviewerId: string,
  decision: ReviewDecisionInput
) {
  const request = await prisma.verificationRequest.findUnique({ where: { id: requestId } });
  if (!request) throw ApiError.notFound("Verification request not found");

  return prisma.$transaction(async (tx) => {
    const updated = await tx.verificationRequest.update({
      where: { id: requestId },
      data: {
        status: decision.status,
        notes: decision.notes ?? request.notes,
        reviewedAt: new Date(),
        reviewerId,
      },
      include: { documents: true },
    });

    await tx.user.update({
      where: { id: request.userId },
      data: { verificationStatus: decision.status },
    });

    return updated;
  });
}
