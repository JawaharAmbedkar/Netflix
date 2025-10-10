const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@repo'] = path.resolve(__dirname, '../../packages');
    return config;
  },
};

module.exports = nextConfig;
