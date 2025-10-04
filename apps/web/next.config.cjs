// apps/web/next.config.js
const withTM = require('next-transpile-modules')(['@repo/db']);

module.exports = withTM({
  reactStrictMode: true,
  experimental: { optimizeCss: false }, // optional
});
