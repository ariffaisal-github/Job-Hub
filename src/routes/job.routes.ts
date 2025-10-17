import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as jobCtrl from "../controllers/job.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job posting and management endpoints
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting
 *     description: |
 *       Only **Employers** can create job postings under their organization.
 *       Use **Employer’s JWT token** in Bearer header.
 *       The first 3 jobs are free; beyond that requires payment via Stripe.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Frontend Developer"
 *               description:
 *                 type: string
 *                 example: "React/Next.js experience required"
 *               location:
 *                 type: string
 *                 example: "Remote"
 *               type:
 *                 type: string
 *                 example: "Full-time"
 *     responses:
 *       201:
 *         description: Job created successfully.
 *       402:
 *         description: Payment required after 3 free posts.
 *       401:
 *         description: Unauthorized or invalid employer token.
 */
r.post("/", verifyToken, requireRole(Role.EMPLOYER), jobCtrl.createJob);

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all job listings
 *     description: |
 *       Public endpoint — anyone (including unauthenticated users) can view all job posts.
 *       Optionally include filters in query (not implemented yet).
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all available jobs.
 */
r.get("/", jobCtrl.getAllJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     description: |
 *       Public endpoint to view detailed job info, including organization and applications (if allowed).
 *       **No token required.**
 *     tags: [Jobs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *           example: "a91f7b43-5d2a-4967-9b58-c2a1a74d9cc1"
 *     responses:
 *       200:
 *         description: Returns job details.
 *       404:
 *         description: Job not found.
 */
r.get("/:id", jobCtrl.getJobById);

/**
 * @swagger
 * /api/jobs/{id}:
 *   patch:
 *     summary: Update a job posting
 *     description: |
 *       Only **the Employer who created the job** can update it.
 *       Pass **Employer’s JWT token** in Bearer header.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully.
 *       403:
 *         description: Employer not authorized for this job.
 *       404:
 *         description: Job not found.
 */
r.patch("/:id", verifyToken, requireRole(Role.EMPLOYER), jobCtrl.updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job posting
 *     description: |
 *       Only **Employers** can delete their own job posts.
 *       Pass **Employer’s JWT token** in Bearer header.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully.
 *       403:
 *         description: Unauthorized.
 *       404:
 *         description: Job not found.
 */
r.delete("/:id", verifyToken, requireRole(Role.EMPLOYER), jobCtrl.deleteJob);

export default r;
