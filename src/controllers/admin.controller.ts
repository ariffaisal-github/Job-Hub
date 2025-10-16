import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await adminService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (e) {
    next(e);
  }
}

export async function getAllEmployers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const employers = await adminService.getAllEmployers();
    res.json({ success: true, data: employers });
  } catch (e) {
    next(e);
  }
}

export async function getAllEmployees(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const employees = await adminService.getAllEmployees();
    res.json({ success: true, data: employees });
  } catch (e) {
    next(e);
  }
}

export async function getAllOrganizations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orgs = await adminService.getAllOrganizations();
    res.json({ success: true, data: orgs });
  } catch (e) {
    next(e);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await adminService.deleteUserById(req.params.id!);
    res.json({ success: true, message: "User deleted", data: result });
  } catch (e) {
    next(e);
  }
}

export async function deleteOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await adminService.deleteOrgById(req.params.id!);
    res.json({ success: true, message: "Organization deleted", data: result });
  } catch (e) {
    next(e);
  }
}
