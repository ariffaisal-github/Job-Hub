import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("✅ Prisma connected"))
  .catch((err: any) => console.error("❌ Prisma connection error", err));
