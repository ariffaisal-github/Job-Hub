import { Request, Response, NextFunction } from "express";
import * as interviewService from "../services/interview.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { applicantId, jobId, scheduledTime, notes } = req.body;
    const result = await interviewService.createInterview(
      user.id,
      applicantId,
      jobId,
      scheduledTime,
      notes
    );
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const data = await interviewService.getInterviewsForUser(
      user.id,
      user.role
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const result = await interviewService.cancelInterview(
      req.params.id!,
      user.id
    );
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
}

export async function reschedule(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { newTime } = req.body;
    const result = await interviewService.rescheduleInterview(
      req.params.id!,
      user.id,
      newTime
    );
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
}
