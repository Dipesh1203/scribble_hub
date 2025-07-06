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
};

export default nextConfig;
