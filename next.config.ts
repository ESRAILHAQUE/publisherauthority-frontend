import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Security headers to prevent CVE-2025-55182 (React2Shell)
  async headers() {
    const isDevelopment = process.env.NODE_ENV === "development";

    const headers = [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
    ];

    // CSP configuration
    if (isDevelopment) {
      // In development: Very permissive CSP to allow Next.js HMR WebSocket and Socket.IO
      // Allow all localhost connections (common ports: 3000, 3003, 5003, etc.)
      headers.push({
        key: "Content-Security-Policy",
        value: [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' http://localhost:3000 http://localhost:3003 http://localhost:5003 https://localhost:5003 ws://localhost:3000 ws://localhost:3003 ws://localhost:5003 wss://localhost:3000 wss://localhost:3003 wss://localhost:5003 ws://127.0.0.1:3000 ws://127.0.0.1:3003 ws://127.0.0.1:5003 https://publisherauthority.com",
        ].join("; "),
      });
    } else {
      // In production: Strict CSP
      headers.push({
        key: "Content-Security-Policy",
        value:
          "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://publisherauthority.com;",
      });
    }

    return [
      {
        source: "/:path*",
        headers,
      },
    ];
  },
};

export default nextConfig;
