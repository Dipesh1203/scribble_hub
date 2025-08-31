import { Request } from "express";

// Extended Express Request interface
export interface AuthRequest extends Request {
  userId?: string;
}