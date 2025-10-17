import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import * as controller from "../controllers/interview.controller";

const r = Router();
r.use(verifyToken);

r.post("/", controller.create);
r.get("/", controller.list);
r.post("/:id/cancel", controller.cancel);
r.post("/:id/reschedule", controller.reschedule);

export default r;
