import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Canonical host: send www.ruudjuffermans.nl → ruudjuffermans.nl (apex is
      // canonical, matching NEXT_PUBLIC_SITE_URL). Only fires when Traefik
      // actually routes the www host to this app — see the Dokploy note below.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.ruudjuffermans\\.nl" }],
        destination: "https://ruudjuffermans.nl/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
