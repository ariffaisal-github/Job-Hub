import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as jobCtrl from "../controllers/job.controller";

const r = Router();

r.post("/", verifyToken, requireRole(Role.EMPLOYER), jobCtrl.createJob);
r.get("/", jobCtrl.getAllJobs);
r.get("/:id", jobCtrl.getJobById);
r.patch("/:id", verifyToken, requireRole(Role.EMPLOYER), jobCtrl.updateJob);
r.delete("/:id", verifyToken, requireRole(Role.EMPLOYER), jobCtrl.deleteJob);

export default r;
