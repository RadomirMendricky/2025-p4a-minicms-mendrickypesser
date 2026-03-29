import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allows Vercel to build even with TypeScript type warnings.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: [
    "@libsql/client",
    "@prisma/adapter-libsql",
    "@prisma/adapter-pg",
    "bcryptjs",
    "pg",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
