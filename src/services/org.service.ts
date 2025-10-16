import { prisma } from "../config/prisma";

export async function createOrganization(ownerId: string, name: string) {
  return prisma.organization.create({
    data: { name, ownerId },
  });
}

export async function addMember(orgId: string, memberEmail: string) {
  const member = await prisma.user.findUnique({
    where: { email: memberEmail },
  });
  if (!member) throw new Error("User not found");

  return prisma.orgMember.create({
    data: { orgId, userId: member.id },
  });
}

export async function getOrgsByOwner(ownerId: string) {
  return prisma.organization.findMany({
    where: { ownerId },
    include: { members: { include: { user: true } } },
  });
}
