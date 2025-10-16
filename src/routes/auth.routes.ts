import { Router } from "express";
import { signup, verifyOtp, login } from "../controllers/auth.controller";

const r = Router();

r.post("/signup", signup);
r.post("/verify", verifyOtp);
r.post("/login", login);

export default r;
