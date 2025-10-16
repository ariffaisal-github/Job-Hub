import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as appCtrl from "../controllers/application.controller";

const r = Router();

r.post(
  "/:jobId/apply",
  verifyToken,
  requireRole(Role.EMPLOYEE),
  appCtrl.applyForJob
);
r.get("/my", verifyToken, requireRole(Role.EMPLOYEE), appCtrl.myApplications);

export default r;
