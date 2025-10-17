import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as appCtrl from "../controllers/application.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application endpoints for employees and employers
 */

/**
 * @swagger
 * /api/applications/{jobId}/apply:
 *   post:
 *     summary: Apply to a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter:
 *                 type: string
 *                 example: "I’m very interested in this role..."
 *     responses:
 *       201:
 *         description: Application submitted successfully.
 *       400:
 *         description: Already applied or invalid job ID.
 */
r.post(
  "/:jobId/apply",
  verifyToken,
  requireRole(Role.EMPLOYEE),
  appCtrl.applyForJob
);

/**
 * @swagger
 * /api/applications/my:
 *   get:
 *     summary: Get my submitted applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user’s applications.
 */
r.get("/my", verifyToken, requireRole(Role.EMPLOYEE), appCtrl.myApplications);

/**
 * @swagger
 * /api/applications/{jobId}/applicants/download:
 *   get:
 *     summary: Download all applicants for a job as CSV
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: CSV file download link or stream.
 *       401:
 *         description: Unauthorized or invalid employer.
 */
r.get(
  "/:jobId/applicants/download",
  verifyToken,
  requireRole(Role.EMPLOYER),
  appCtrl.downloadApplicants
);

export default r;
