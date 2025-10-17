import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import {
  createOrUpdateProfile,
  getMyProfile,
} from "../controllers/profile.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Manage applicant (employee) profiles and resumes
 */

/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Create or update your profile
 *     description: |
 *       Only **Employees (applicants)** can create or update their profiles.
 *       Pass **Employee’s JWT token** in Bearer header.
 *       Employers and Admins are not allowed to modify profiles through this route.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the applicant
 *                 example: "John Doe"
 *               headline:
 *                 type: string
 *                 description: Short professional summary or title
 *                 example: "Full Stack Developer | React + Node.js"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React", "PostgreSQL"]
 *               resumeJson:
 *                 type: object
 *                 description: JSON-encoded resume data (used for generating PDF)
 *                 example:
 *                   experience: "3 years at Acme Inc"
 *                   education: "BSc Computer Science"
 *     responses:
 *       201:
 *         description: Profile created or updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized or not an Employee.
 */
r.post("/", verifyToken, requireRole(Role.EMPLOYEE), createOrUpdateProfile);

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Get logged-in employee’s profile
 *     description: |
 *       Returns the profile of the **logged-in Employee** only.
 *       Pass **Employee’s JWT token** in Bearer header.
 *       Employers and Admins cannot use this endpoint.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the profile details of the current employee.
 *       404:
 *         description: Profile not found for this user.
 */
r.get("/me", verifyToken, requireRole(Role.EMPLOYEE), getMyProfile);

export default r;
