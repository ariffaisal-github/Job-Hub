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
 *   description: Job application management for Employees (Applicants) and Employers
 */

/**
 * @swagger
 * /api/applications/{jobId}/apply:
 *   post:
 *     summary: Apply to a specific job
 *     description: |
 *       Used by **Employees (applicants)** to apply for a job.
 *       Requires the **Employee’s JWT token** in Bearer header.
 *       Each applicant can apply only once per job.
 *
 *       The `jobId` should be taken from a job listed via `/api/jobs`.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID of the job to apply for
 *         schema:
 *           type: string
 *           example: "c91f7b43-5d2a-4967-9b58-c2a1a74d9cc1"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter:
 *                 type: string
 *                 description: Optional cover letter text
 *                 example: "I’m very interested in this role because I have 3 years of React experience."
 *     responses:
 *       201:
 *         description: Application submitted successfully.
 *       400:
 *         description: Invalid job ID or already applied.
 *       401:
 *         description: Missing or invalid Employee token.
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
 *     summary: Get all applications submitted by the logged-in employee
 *     description: |
 *       Fetches all job applications created by the **logged-in Employee**.
 *       Requires the **Employee’s JWT token** in Bearer header.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of all applications submitted by this employee.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "b8e4d6f0-1c24-4b47-b6cb-2c7fd0ffb1aa"
 *                       jobId:
 *                         type: string
 *                         example: "c91f7b43-5d2a-4967-9b58-c2a1a74d9cc1"
 *                       status:
 *                         type: string
 *                         example: "PENDING"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-15T12:34:56.000Z"
 *       401:
 *         description: Unauthorized or invalid Employee token.
 */
r.get("/my", verifyToken, requireRole(Role.EMPLOYEE), appCtrl.myApplications);

/**
 * @swagger
 * /api/applications/{jobId}/applicants/download:
 *   get:
 *     summary: Download all applicants for a specific job (CSV export)
 *     description: |
 *       Used by **Employers** to export a list of all applicants for one of their jobs.
 *       Requires the **Employer’s JWT token** in Bearer header.
 *       The `jobId` must belong to one of the logged-in employer’s posted jobs.
 *
 *       Response returns a downloadable CSV file containing applicant info such as name, email, and status.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: Job ID owned by the employer
 *         schema:
 *           type: string
 *           example: "e2b4a1e0-4f58-4d67-9a90-3f37a67d9c11"
 *     responses:
 *       200:
 *         description: CSV download containing applicant list.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: |
 *                 name,email,status
 *                 John Doe,john@example.com,PENDING
 *                 Jane Smith,jane@example.com,APPROVED
 *       401:
 *         description: Unauthorized or invalid Employer token.
 *       403:
 *         description: Job not owned by this employer.
 *       404:
 *         description: Job not found.
 */
r.get(
  "/:jobId/applicants/download",
  verifyToken,
  requireRole(Role.EMPLOYER),
  appCtrl.downloadApplicants
);

export default r;
