import { Router } from "express";
import {
  getAllUsers,
  getAllEmployers,
  getAllEmployees,
  getAllOrganizations,
  deleteUser,
  deleteOrganization,
} from "../controllers/admin.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { requireRole } from "../middlewares/role.middleware";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only management endpoints
 */

// Restrict all routes to Admins only
r.use(verifyToken, requireRole(Role.ADMIN));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users.
 */
r.get("/users", getAllUsers);

/**
 * @swagger
 * /api/admin/employers:
 *   get:
 *     summary: Get all employers and their organizations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employers listed successfully.
 */
r.get("/employers", getAllEmployers);

/**
 * @swagger
 * /api/admin/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employees listed successfully.
 */
r.get("/employees", getAllEmployees);

/**
 * @swagger
 * /api/admin/organizations:
 *   get:
 *     summary: Get all organizations with members
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organizations listed successfully.
 */
r.get("/organizations", getAllOrganizations);

/**
 * @swagger
 * /api/admin/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Constraint or validation error.
 */
r.delete("/user/:id", deleteUser);

/**
 * @swagger
 * /api/admin/organization/{id}:
 *   delete:
 *     summary: Delete an organization by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Organization ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization deleted successfully.
 */
r.delete("/organization/:id", deleteOrganization);

export default r;
