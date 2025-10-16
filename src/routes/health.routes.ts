import { Router } from "express";
import { redis } from "../config/redis";
import { prisma } from "../config/prisma";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";

const r = Router();

r.get("/health", async (_req, res) => {
  const pong = await redis.ping();
  res.json({ ok: true, redis: pong });
});
// test DB connectivity
r.get("/dbcheck", async (_req, res, next) => {
  try {
    const count = await prisma.user.count();
    res.json({ ok: true, users: count });
  } catch (err) {
    next(err);
  }
});
r.get("/secure", verifyToken, (_req, res) =>
  res.json({ ok: true, message: "Token valid" })
);

r.get("/admin-only", verifyToken, requireRole(Role.ADMIN), (_req, res) => {
  res.json({ success: true, message: "Admin access granted" });
});

r.get(
  "/employer-or-admin",
  verifyToken,
  requireRole([Role.EMPLOYER, Role.ADMIN]),
  (_req, res) => {
    res.json({ success: true, message: "Employer/Admin access granted" });
  }
);

export default r;
