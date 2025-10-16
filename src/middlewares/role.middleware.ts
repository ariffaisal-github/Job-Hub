import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client"; // Role enum is in Prisma schema

export function requireRole(roles: Role[] | Role) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });
    }

    if (!allowed.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of: ${allowed.join(", ")}`,
      });
    }

    next();
  };
}
