import { z } from "zod";

export const env = z
  .object({
    PORT: z.string().default("4000"),
    DATABASE_URL: z
      .string()
      .default("postgresql://postgres:postgres@db:5432/postgres"),
    REDIS_URL: z.string().default("redis://redis:6379"),
    JWT_SECRET: z.string().default("supersecret"),
    STRIPE_SECRET_KEY: z.string().nonempty("STRIPE_SECRET_KEY is required"),
  })
  .parse(process.env);
