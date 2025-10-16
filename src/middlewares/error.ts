import { Request, Response, NextFunction } from "express";
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[${req.method}] ${req.url}:`, err?.message || err);
  const code = err?.statusCode ?? 500;
  res
    .status(code)
    .json({ success: false, message: err?.message ?? "Internal error" });
}
