import { prisma } from "../config/prisma";
import { Parser } from "json2csv";

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

export async function downloadApplicants(employerId: string, jobId: string) {
  // 1️⃣ Verify that this job belongs to the employer
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { org: true },
  });

  if (!job) throw new Error("Job not found");
  if (job.org.ownerId !== employerId)
    throw new Error("Not authorized to view this job applicants");

  // 2️⃣ Fetch all applicants for the job
  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      applicant: {
        include: { profile: true },
      },
    },
  });

  if (!applications.length) throw new Error("No applicants yet");

  // 3️⃣ Prepare CSV data
  const rows = applications.map((a: any) => ({
    email: a.applicant.email,
    role: a.applicant.role,
    status: a.status,
    appliedAt: a.createdAt.toISOString(),
  }));

  // 4️⃣ Convert JSON → CSV
  const parser = new Parser({
    fields: ["email", "role", "status", "appliedAt"],
  });
  const csv = parser.parse(rows);

  return csv;
}
