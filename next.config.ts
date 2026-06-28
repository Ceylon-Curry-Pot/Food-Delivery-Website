import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        // Allow any HTTPS image URL for menu items uploaded by admin
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;