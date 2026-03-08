import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow loading images from Supabase Storage and external CDNs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "usaibrahimalqurashi.com",
      },
      {
        protocol: "https",
        hostname: "ibraqperfumes.com",
      },
    ],
  },

  // Production security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
