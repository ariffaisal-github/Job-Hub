import { prisma } from "../config/prisma";

export async function upsertProfile(userId: string, data: any) {
  const { name, headline, skills, resumeJson } = data;
  return prisma.profile.upsert({
    where: { userId },
    update: { name, headline, skills, resumeJson },
    create: { userId, name, headline, skills, resumeJson },
  });
}

export async function getProfileByUser(userId: string) {
  return prisma.profile.findUnique({ where: { userId } });
}
