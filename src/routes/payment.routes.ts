import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as paymentCtrl from "../controllers/payment.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe-based payment processing for paid job postings
 */

/**
 * @swagger
 * /api/payments/checkout:
 *   post:
 *     summary: Create Stripe checkout session for posting paid job
 *     description: |
 *       Only **Employers** can initiate payments.
 *       Pass **Employer’s JWT token** in Bearer header.
 *       Use this endpoint after exceeding 3 free job posts.
 *       On success, a Stripe checkout session URL is returned.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount in USD (e.g., 2 per job post)
 *                 example: 2
 *               jobId:
 *                 type: string
 *                 description: Optional Job ID if payment is tied to a specific job
 *                 example: "a1b2c3d4-e5f6-7890-abcd-1234567890ef"
 *     responses:
 *       200:
 *         description: Stripe checkout session created.
 *       401:
 *         description: Unauthorized or missing Employer token.
 *       400:
 *         description: Invalid job or payment amount.
 */
r.post(
  "/checkout",
  verifyToken,
  requireRole(Role.EMPLOYER),
  paymentCtrl.createCheckout
);

/**
 * @swagger
 * /api/payments/success:
 *   get:
 *     summary: Handle successful Stripe payment
 *     description: |
 *       Redirect endpoint called by Stripe after successful payment.
 *       Updates job/payment status in database.
 *       **Public endpoint** – no token required.
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment processed successfully.
 */
r.get("/success", paymentCtrl.success);

/**
 * @swagger
 * /api/payments/cancel:
 *   get:
 *     summary: Handle canceled Stripe payment
 *     description: |
 *       Redirect endpoint called by Stripe if the user cancels checkout.
 *       **Public endpoint** – no token required.
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment canceled by user.
 */
r.get("/cancel", paymentCtrl.cancel);

export default r;
