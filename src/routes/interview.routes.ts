import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import * as controller from "../controllers/interview.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Interviews
 *   description: Manage interviews between employers and job applicants
 */

r.use(verifyToken);

/**
 * @swagger
 * /api/interviews:
 *   post:
 *     summary: Employer schedules an interview with a specific applicant for a job
 *     description: |
 *       **Only employers** can schedule an interview for one of their job postings.
 *       You must provide an **Employer’s JWT token** in the Bearer header.
 *       The `applicantId` must be the ID of a user who has already applied for the given job.
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - applicantId
 *               - scheduledTime
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID of the job for which the interview is being scheduled
 *                 example: "b8e4d6f0-1c24-4b47-b6cb-2c7fd0ffb1aa"
 *               applicantId:
 *                 type: string
 *                 description: ID of the applicant (employee) to be interviewed
 *                 example: "d91aa9a3-1b2f-4a01-b8f8-7bcb4b2b36bb"
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *                 description: ISO timestamp of the scheduled interview
 *                 example: "2025-10-18T15:00:00.000Z"
 *               notes:
 *                 type: string
 *                 description: Optional message or interview details
 *                 example: "Initial technical interview via Google Meet"
 *     responses:
 *       201:
 *         description: Interview scheduled successfully.
 *       400:
 *         description: Invalid job or applicant ID, or user not allowed.
 *       401:
 *         description: Missing or invalid Employer token.
 */
r.post("/", controller.create);

/**
 * @swagger
 * /api/interviews:
 *   get:
 *     summary: List all interviews related to the logged-in user
 *     description: |
 *       Returns all interviews where the user is either:
 *       - the **Employer** (who created the interview), or
 *       - the **Applicant** (who was invited).
 *       Use **either Employer or Employee JWT** in Bearer token.
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all interviews (past, upcoming, cancelled, etc.) for the logged-in user.
 *       401:
 *         description: Missing or invalid JWT token.
 */
r.get("/", controller.list);

/**
 * @swagger
 * /api/interviews/{id}/cancel:
 *   post:
 *     summary: Cancel a scheduled interview
 *     description: |
 *       Cancels a previously scheduled interview.
 *       Either the **Employer** who created the interview or the **Applicant** can cancel.
 *       Pass **your own JWT token** in Bearer header, and the interview `id` in the path.
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the interview to cancel
 *         schema:
 *           type: string
 *           example: "5bfbeb9f-37cb-4a6d-9ee5-11b17d38cb8e"
 *     responses:
 *       200:
 *         description: Interview cancelled successfully.
 *       403:
 *         description: User not authorized to cancel this interview.
 *       404:
 *         description: Interview not found.
 */
r.post("/:id/cancel", controller.cancel);

/**
 * @swagger
 * /api/interviews/{id}/reschedule:
 *   post:
 *     summary: Request to reschedule a scheduled interview
 *     description: |
 *       Either **Employer** or **Applicant** can request to reschedule an existing interview.
 *       Provide your **own JWT token** in Bearer header, and specify the new date/time.
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the interview to reschedule
 *         schema:
 *           type: string
 *           example: "4c3a5e61-f799-44c1-8a8b-72db2e93b99f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newTime
 *             properties:
 *               newTime:
 *                 type: string
 *                 format: date-time
 *                 description: The new proposed interview time (ISO 8601 format)
 *                 example: "2025-10-19T14:00:00.000Z"
 *               notes:
 *                 type: string
 *                 description: Optional reason for rescheduling
 *                 example: "Applicant requested to move to next day due to conflict"
 *     responses:
 *       200:
 *         description: Reschedule request recorded successfully.
 *       404:
 *         description: Interview not found.
 *       403:
 *         description: User not authorized to reschedule this interview.
 */
r.post("/:id/reschedule", controller.reschedule);

export default r;
