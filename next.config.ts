import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { hostname: "encrypted-tbn0.gstatic.com" },
      { hostname: "www.merquellantas.com" },
    ],
  },
};

export default nextConfig;
