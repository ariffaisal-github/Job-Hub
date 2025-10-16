import { Request, Response, NextFunction } from "express";
import * as appService from "../services/application.service";

export async function applyForJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const result = await appService.apply(
      user.id,
      req.params.jobId!,
      req.body.coverLetter
    );
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function myApplications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const apps = await appService.listMine(user.id);
    res.json({ success: true, data: apps });
  } catch (e) {
    next(e);
  }
}
