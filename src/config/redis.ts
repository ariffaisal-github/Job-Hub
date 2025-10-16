import Redis from "ioredis";
import { env } from "../utils/env";

export const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (e) => console.error("Redis error", e));
