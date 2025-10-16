import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as paymentCtrl from "../controllers/payment.controller";

const r = Router();

r.post(
  "/checkout",
  verifyToken,
  requireRole(Role.EMPLOYER),
  paymentCtrl.createCheckout
);
r.get("/success", paymentCtrl.success);
r.get("/cancel", paymentCtrl.cancel);

export default r;
