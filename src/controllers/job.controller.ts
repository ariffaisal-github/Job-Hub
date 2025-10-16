import { Request, Response, NextFunction } from "express";
import * as jobService from "../services/job.service";

export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const result = await jobService.createJob(user.id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function getAllJobs(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const jobs = await jobService.getAllJobs();
    res.json({ success: true, data: jobs });
  } catch (e) {
    next(e);
  }
}

export async function getJobById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const job = await jobService.getJobById(req.params.id!);
    res.json({ success: true, data: job });
  } catch (e) {
    next(e);
  }
}

export async function updateJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const job = await jobService.updateJob(req.params.id!, req.body);
    res.json({ success: true, data: job });
  } catch (e) {
    next(e);
  }
}

export async function deleteJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await jobService.deleteJob(req.params.id!);
    res.json({ success: true, message: "Job deleted" });
  } catch (e) {
    next(e);
  }
}
