import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ]
  },

  async rewrites() {
    return [
      {
        source: '/events/:slug*',
        destination: '/events/:slug*',
      }
    ]
  }

};

export default nextConfig;
