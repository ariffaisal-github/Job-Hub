import { prisma } from "../config/prisma";

export async function createJob(ownerId: string, data: any) {
  // find employer org first
  const org = await prisma.organization.findFirst({ where: { ownerId } });
  if (!org) throw new Error("Employer has no organization yet");

  // count jobs by this org
  const jobCount = await prisma.job.count({ where: { orgId: org.id } });

  // first 3 free, after that mark as PAID_PENDING
  const paymentRequired = jobCount >= 3;
  const job = await prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      type: data.type,
      orgId: org.id,
    },
  });

  return { job, paymentRequired };
}

export async function getAllJobs() {
  return prisma.job.findMany({
    include: { org: true },
  });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: { org: true, applications: true },
  });
}

export async function updateJob(id: string, data: any) {
  return prisma.job.update({
    where: { id },
    data,
  });
}

export async function deleteJob(id: string) {
  return prisma.job.delete({ where: { id } });
}
