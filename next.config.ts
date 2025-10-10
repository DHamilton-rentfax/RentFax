import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      "https://3001-firebase-studio-1754325563199.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
  },
};

export default nextConfig;
