/** @type {import('next').NextConfig} */
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:4000";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/api/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
