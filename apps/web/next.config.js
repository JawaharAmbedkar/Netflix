const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Resolve '@repo' to the packages folder in your monorepo
    config.resolve.alias["@repo"] = path.resolve(__dirname, "../../packages");
    return config;
  },
};

module.exports = nextConfig;
