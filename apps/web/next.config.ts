import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@smartcampus/types"],
};

module.exports = {
  allowedDevOrigins: ["10.2.132.34"]
}

export default nextConfig;
