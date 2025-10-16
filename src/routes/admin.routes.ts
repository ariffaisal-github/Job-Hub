import { Router } from "express";
import {
  getAllUsers,
  getAllEmployers,
  getAllEmployees,
  getAllOrganizations,
  deleteUser,
  deleteOrganization,
} from "../controllers/admin.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { requireRole } from "../middlewares/role.middleware";

const r = Router();

// Restrict all routes to Admins only
r.use(verifyToken, requireRole(Role.ADMIN));

r.get("/users", getAllUsers);
r.get("/employers", getAllEmployers);
r.get("/employees", getAllEmployees);
r.get("/organizations", getAllOrganizations);

r.delete("/user/:id", deleteUser);
r.delete("/organization/:id", deleteOrganization);

export default r;
