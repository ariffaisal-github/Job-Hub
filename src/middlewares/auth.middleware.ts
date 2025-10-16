import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  const parts = auth.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ success: false, message: "Malformed token" });
  }
  const token = parts[1]!;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET!) as any;
    (req as any).user = payload; // attach to request
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
