import { Router } from "express";
import { signup, verifyOtp, login } from "../controllers/auth.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: SignUp and Login
 *   description: User authentication and verification
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user (Employee, Employer, or Admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: mysecret
 *               role:
 *                 type: string
 *                 enum: [ADMIN, EMPLOYER, EMPLOYEE]
 *                 default: EMPLOYEE
 *     responses:
 *       201:
 *         description: User created successfully and OTP sent.
 *       400:
 *         description: Validation or existing user error.
 */
r.post("/signup", signup);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify OTP for user signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               code:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: User verified successfully.
 *       400:
 *         description: Invalid or expired OTP.
 */
r.post("/verify", verifyOtp);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in using email/phone and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: mysecret
 *     responses:
 *       200:
 *         description: Successful login returns JWT token.
 *       401:
 *         description: Invalid credentials.
 */
r.post("/login", login);

export default r;
