import { prisma } from "../config/prisma";
import { messageQueue } from "../config/bullmq";

export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
  jobId?: string
) {
  if (!content.trim()) throw new Error("Message cannot be empty");

  const message = await prisma.message.create({
    data: { senderId, receiverId, content, jobId: jobId ?? null },
  });

  // Push to queue for async notification processing
  await messageQueue.add("send", { senderId, receiverId, content });

  return message;
}

export async function getConversation(userId: string, otherId: string) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
    },
    orderBy: { sentAt: "asc" },
  });
}
