import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import { createOrg, addMember, myOrgs } from "../controllers/org.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Manage employer organizations and members
 */

/**
 * @swagger
 * /api/org:
 *   post:
 *     summary: Create a new organization
 *     description: |
 *       Only **Employers** can create organizations.
 *       Use **Employer’s JWT token** in Bearer header.
 *     tags: [Organizations]
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
 *                 example: "TechNova Solutions"
 *     responses:
 *       201:
 *         description: Organization created successfully.
 *       401:
 *         description: Unauthorized or not an employer.
 */
r.post("/", verifyToken, requireRole(Role.EMPLOYER), createOrg);

/**
 * @swagger
 * /api/org/{orgId}/add-member:
 *   post:
 *     summary: Add a member (employee) to your organization
 *     description: |
 *       Only the **Employer who owns the organization** can add members.
 *       Pass **Employer’s JWT token** in Bearer header, and the target employee’s ID in the request body.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         description: Organization ID
 *         schema:
 *           type: string
 *           example: "c2a51b19-fb8e-4a6a-a667-7f8c94b63f84"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the employee being added
 *                 example: "f9d28c65-925d-4b5f-b1fa-3dfd4a5cbf22"
 *               role:
 *                 type: string
 *                 description: Role inside the organization
 *                 example: "Recruiter"
 *     responses:
 *       200:
 *         description: Member added successfully.
 *       403:
 *         description: Not authorized to modify this organization.
 */
r.post(
  "/:orgId/add-member",
  verifyToken,
  requireRole(Role.EMPLOYER),
  addMember
);

/**
 * @swagger
 * /api/org/mine:
 *   get:
 *     summary: Get organizations owned by the logged-in employer
 *     description: |
 *       Returns all organizations created by the **logged-in Employer**.
 *       Requires **Employer’s JWT token**.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations created by this employer.
 */
r.get("/mine", verifyToken, requireRole(Role.EMPLOYER), myOrgs);

export default r;
