/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@repo/db']);

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
