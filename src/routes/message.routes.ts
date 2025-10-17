import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import * as msgCtrl from "../controllers/message.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Real-time messaging between applicants and employers (powered by BullMQ)
 */

r.use(verifyToken);

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message between two users
 *     description: |
 *       Any **authenticated user** (Employer or Employee) can send a message.
 *       Pass **your own JWT token** in Bearer header.
 *       The `receiverId` should be the **user ID** of the person you’re messaging.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the recipient (Employer or Employee)
 *                 example: "acb12345-6789-4abc-b987-5f0de8b2f3e4"
 *               content:
 *                 type: string
 *                 description: Message text
 *                 example: "Hello! Is the position still open?"
 *               jobId:
 *                 type: string
 *                 description: Optional job ID (to link chat to a job)
 *                 example: "b7a8e72e-1f1d-4e42-9d71-6f2a74dfd511"
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *       400:
 *         description: Invalid receiver or job ID.
 */
r.post("/send", msgCtrl.sendMessage);

/**
 * @swagger
 * /api/messages/conversation/{otherId}:
 *   get:
 *     summary: Get conversation between current user and another user
 *     description: |
 *       Fetches all messages exchanged between the **logged-in user** and another user (`otherId`).
 *       Pass **your own JWT token** in Bearer header.
 *       Use the **other user’s ID** as the path parameter.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: otherId
 *         in: path
 *         required: true
 *         description: The ID of the other user in the conversation
 *         schema:
 *           type: string
 *           example: "bbdfc444-7b6f-4bb4-b5a7-96ecf6fbdc91"
 *     responses:
 *       200:
 *         description: List of messages in the conversation.
 *       404:
 *         description: No messages found between these users.
 */
r.get("/conversation/:otherId", msgCtrl.getConversation);

export default r;
