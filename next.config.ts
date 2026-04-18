import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aqbuksiaizejppgdlkdc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  devIndicators: {
    position: 'top-right',
  },
};

export default nextConfig;
