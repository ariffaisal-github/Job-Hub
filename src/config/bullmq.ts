import { Queue, Worker } from "bullmq";
import { redis } from "./redis";

export const messageQueue = new Queue("messages", {
  connection: redis.options,
});

// Optional: worker to process queued messages
export const messageWorker = new Worker(
  "messages",
  async (job: any) => {
    const { senderId, receiverId, content } = job.data;
    console.log(`📩 Message from ${senderId} → ${receiverId}: ${content}`);
    // Here, you could later integrate socket.io or email notification
  },
  { connection: redis.options }
);

messageWorker.on("completed", (job) =>
  console.log(`✅ Message job ${job.id} processed.`)
);

messageWorker.on("failed", (job, err) =>
  console.error(`❌ Message job ${job?.id} failed:`, err)
);
