import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Security headers applied to every route.
   * Fonts are self-hosted by next/font — no external CSP entries needed.
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Disallow iframes (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Legacy XSS filter (still useful for older browsers)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Limit referrer leakage
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser feature access
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content-Security-Policy
          // 'unsafe-inline' required by Next.js for inline scripts/styles during hydration.
          // No external origins needed — fonts are self-hosted.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
