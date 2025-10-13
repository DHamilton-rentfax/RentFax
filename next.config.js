import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: [
    'https://3000-firebase-studio-1754325563199.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev'
  ],
  experimental: {},
};

export default withNextIntl(nextConfig);
