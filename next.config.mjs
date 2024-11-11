/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;