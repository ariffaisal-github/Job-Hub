import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import { createOrg, addMember, myOrgs } from "../controllers/org.controller";

const r = Router();

r.post("/", verifyToken, requireRole(Role.EMPLOYER), createOrg);
r.post(
  "/:orgId/add-member",
  verifyToken,
  requireRole(Role.EMPLOYER),
  addMember
);
r.get("/mine", verifyToken, requireRole(Role.EMPLOYER), myOrgs);

export default r;
