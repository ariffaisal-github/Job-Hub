import { Request, Response, NextFunction } from "express";
import * as msgService from "../services/message.service";

export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { receiverId, content, jobId } = req.body;
    const msg = await msgService.sendMessage(
      user.id,
      receiverId,
      content,
      jobId
    );
    res.status(201).json({ success: true, data: msg });
  } catch (e) {
    next(e);
  }
}

export async function getConversation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { otherId } = req.params;
    const messages = await msgService.getConversation(user.id, otherId!);
    res.json({ success: true, data: messages });
  } catch (e) {
    next(e);
  }
}
