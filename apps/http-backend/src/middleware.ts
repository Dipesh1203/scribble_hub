import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  const authHeader = req.headers["authorization"] ?? "";
  const token1 = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : "";

  const decoded = jwt.verify(token1 || "", JWT_SECRET);
  if (decoded) {
    // @ts-ignore: TODO: Fix this
    req.userId = decoded.userId;
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
}
