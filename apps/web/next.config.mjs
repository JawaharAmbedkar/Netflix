import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@repo'] = path.resolve('./../../packages');
    return config;
  },
};

export default nextConfig;
