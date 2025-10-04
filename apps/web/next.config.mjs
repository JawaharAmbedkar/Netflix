import withTM from "next-transpile-modules";

// Transpile shared packages (like @repo/db) for Next.js
const withTMConfig = withTM({
  transpilePackages: ["@repo/db"],
  experimental: {
    optimizeCss: false, // disable CSS optimization issues
  },
  reactStrictMode: true,  // optional but recommended
  swcMinify: true,         // enable SWC minifier
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  },
});

export default withTMConfig;
