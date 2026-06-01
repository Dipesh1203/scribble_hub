export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3000";
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || process.env.WS_URL || "ws://localhost:3002";
export const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  process.env.FRONTEND_URL ||
  "http://localhost:3003";
export const JWT_SECRET =process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET || "Dipesh";
export const LLM_URL = process.env.LLM_URL || "Dipesh";
export const LLM_TOKEN = process.env.LLM_TOKEN || "Dipesh";
