import express from "express";
import { Role } from "../entities/role";

export function admin(req: express.Request, res: express.Response, next: any) {
  const user = (req as any).user;
  const role: Role = <Role>(user as any).role;
  if (role === Role.Admin) {
    next();
  } else {
    return res.status(403).send("Acess denied. ");
  }
}
