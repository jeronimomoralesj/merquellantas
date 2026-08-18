import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { hostname: "encrypted-tbn0.gstatic.com" },
      { hostname: "www.merquellantas.com" },
      { hostname: "scontent2.llantas.mx" },
      { hostname: "www.alkosto.com" },
      { hostname: "www.wheelcompany.com.co" },
      { hostname: "media.istockphoto.com" },
    ],
  },
};

export default nextConfig;
