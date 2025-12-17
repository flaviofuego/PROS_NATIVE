/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pros/shared'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;

