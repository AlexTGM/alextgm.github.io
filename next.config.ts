import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ Fixes NextAuth API issue
};

export default nextConfig;
