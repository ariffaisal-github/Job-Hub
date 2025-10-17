import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("🔥 Error caught:", err);

  // ✅ Handle Zod validation errors
  if (err instanceof ZodError) {
    const first = err.issues[0]!;
    return res.status(400).json({
      success: false,
      message: "Validation error occurred.",
      errorDetails: {
        field: first.path.join("."),
        message: first.message,
      },
    });
  }

  // ✅ Handle Auth / Permission errors
  if (err.name === "UnauthorizedError" || err.status === 401) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access.",
      errorDetails:
        err.message || "You must be an admin to perform this action.",
    });
  }

  // ✅ Prisma or database constraint errors
  if (err.code === "P2003") {
    return res.status(400).json({
      success: false,
      message: "Foreign key constraint failed.",
      errorDetails: err.meta?.field_name,
    });
  }

  // ✅ Generic fallback
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
