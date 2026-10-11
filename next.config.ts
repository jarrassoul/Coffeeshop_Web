import type { NextConfig } from "next";

// Security headers applied to every response. CSP note: 'unsafe-inline' /
// 'unsafe-eval' in script-src are required by Next.js itself (the App Router
// streams its payload via inline scripts, and dev HMR uses eval); the React
// runtime escapes all rendered output, so XSS exposure stays contained.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")',
  },
  // Only meaningful once served over HTTPS; harmless in local dev.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      // Menu photos and uploaded payment proofs are stored as data URLs.
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://errors.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Allows running two dev servers at once (customer on 3000, admin on 3001)
  // by giving each its own build directory via the DIST_DIR env var.
  distDir: process.env.DIST_DIR || ".next",
  // Hide the black "N" dev-tools badge in the corner during development.
  devIndicators: false,
  serverExternalPackages: ["@prisma/client"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
