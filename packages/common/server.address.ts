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
