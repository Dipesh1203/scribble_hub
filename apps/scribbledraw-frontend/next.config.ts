import {
  BACKEND_URL,
  FRONTEND_URL,
  WS_URL,
  JWT_SECRET,
  LLM_URL,
  LLM_TOKEN,
} from "@repo/common/server";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
  typescript: {
    ignoreBuildErrors: true, // Use cautiously
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL:
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3002",
    NEXTAUTH_URL:
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3003",
    NEXTAUTH_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET || "Dipesh",
    NEXT_PUBLIC_LLM_URL: process.env.NEXT_PUBLIC_LLM_URL || "",
    NEXT_PUBLIC_LLM_TOKEN: process.env.NEXT_PUBLIC_LLM_TOKEN || "",
  },
};

export default nextConfig;
