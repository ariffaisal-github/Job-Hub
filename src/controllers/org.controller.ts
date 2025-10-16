import { Request, Response, NextFunction } from "express";
import * as orgService from "../services/org.service";

export async function createOrg(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const result = await orgService.createOrganization(user.id, req.body.name);
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function addMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { orgId } = req.params;
    const { memberEmail } = req.body;
    const result = await orgService.addMember(orgId!, memberEmail);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function myOrgs(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const result = await orgService.getOrgsByOwner(user.id);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}
