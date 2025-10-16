import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.service";

export async function createOrUpdateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const result = await profileService.upsertProfile(user.id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function getMyProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const result = await profileService.getProfileByUser(user.id);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}
