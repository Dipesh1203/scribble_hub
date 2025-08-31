import { z } from "zod";
import { Request } from "express";

export const CreateUserSchema = z.object({
  email: z.string().min(3).max(20),
  password: z.string(),
  name: z.string(),
});

export const SigninSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string(),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});

// Type definitions for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: number;
  slug: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: number;
  roomId: number;
  message: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended Express Request interface
export interface AuthRequest extends Request {
  userId?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: unknown[];
}

export interface SuccessResponse<T = unknown> {
  data: T;
}

// API response types
export interface CreateRoomResponse {
  roomId: string;
}

export interface GetRoomResponse {
  room: Room | null;
}

export interface GetChatsResponse {
  messages: Chat[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UserRoomInfo {
  currentRoom?: Room;
  lastJoinedRoom?: Room;
  recentRooms: Room[];
}
