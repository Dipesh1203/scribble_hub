import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000",
    NEXT_PUBLIC_WS_URL: process.env.WS_URL || "ws://localhost:3002",
    NEXT_PUBLIC_FRONTEND_URL:
      process.env.FRONTEND_URL || "http://localhost:3003",
  },
};

export default nextConfig;
