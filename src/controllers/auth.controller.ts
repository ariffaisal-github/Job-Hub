import { Request, Response, NextFunction } from "express";
import {
  signupService,
  verifyOtpService,
  loginService,
} from "../services/auth.service";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const result = await signupService(email, password);
    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    next(err);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP code required" });

    const result = await verifyOtpService(email, code);
    res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const result = await loginService(email, password);
    res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    next(err);
  }
};
