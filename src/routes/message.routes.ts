import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import * as msgCtrl from "../controllers/message.controller";

const r = Router();

r.use(verifyToken);

// POST /api/messages/send
r.post("/send", msgCtrl.sendMessage);

// GET /api/messages/conversation/:otherId
r.get("/conversation/:otherId", msgCtrl.getConversation);

export default r;
