import withTM from "next-transpile-modules";

const nextConfig = withTM(["@repo/db"])({
  reactStrictMode: true,
  experimental: {
    optimizeCss: false,
  },
});

export default nextConfig;
