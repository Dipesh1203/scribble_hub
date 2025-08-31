import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { AuthRequest } from "./types";

export function middleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"] ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : "";

  try {
    const decoded = jwt.verify(token || "", JWT_SECRET) as { userId: string };
    if (decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  } catch {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}
