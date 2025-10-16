import { prisma } from "../config/prisma";

// ✅ 1. Get all users (any role)
export async function getAllUsers() {
  return prisma.user.findMany({
    include: { profile: true, orgs: true },
  });
}

// ✅ 2. Get all employers with their orgs and members
export async function getAllEmployers() {
  return prisma.user.findMany({
    where: { role: "EMPLOYER" },
    include: {
      organizationsOwned: {
        include: {
          members: {
            include: {
              user: {
                select: { id: true, email: true, role: true },
              },
            },
          },
          jobs: true,
        },
      },
    },
  });
}

// ✅ 3. Get all employees (job seekers)
export async function getAllEmployees() {
  return prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    include: { profile: true, applications: true },
  });
}

// ✅ 4. Get all organizations (with members & owner)
export async function getAllOrganizations() {
  return prisma.organization.findMany({
    include: {
      owner: { select: { id: true, email: true } },
      members: {
        include: { user: { select: { id: true, email: true, role: true } } },
      },
      jobs: true,
    },
  });
}

// ✅ 5. Delete any user (admin control)
export async function deleteUserById(id: string) {
  return prisma.user.delete({ where: { id } });
}

// ✅ 6. Delete any organization (admin control)
export async function deleteOrgById(id: string) {
  return prisma.organization.delete({ where: { id } });
}
