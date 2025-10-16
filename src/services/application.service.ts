import { prisma } from "../config/prisma";

export async function apply(
  userId: string,
  jobId: string,
  coverLetter?: string
) {
  const existing = await prisma.application.findFirst({
    where: { applicantId: userId, jobId },
  });
  if (existing) throw new Error("Already applied to this job");

  return prisma.application.create({
    data: { applicantId: userId, jobId, coverLetter: coverLetter ?? null },
  });
}

export async function listMine(userId: string) {
  return prisma.application.findMany({
    where: { applicantId: userId },
    include: { job: true },
  });
}
