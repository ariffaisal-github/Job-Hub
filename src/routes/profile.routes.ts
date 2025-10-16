import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import {
  createOrUpdateProfile,
  getMyProfile,
} from "../controllers/profile.controller";

const r = Router();

r.post("/", verifyToken, requireRole(Role.EMPLOYEE), createOrUpdateProfile);
r.get("/me", verifyToken, requireRole(Role.EMPLOYEE), getMyProfile);

export default r;
