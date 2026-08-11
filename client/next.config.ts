import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // The opengraph-image routes read these TTFs at runtime via fs; the
  // standalone trace doesn't pick that up on its own.
  outputFileTracingIncludes: {
    "/**/*": ["./src/assets/og/*.ttf"],
  },
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
      // /portfolio became /projecten (nl) and /projects (en). Config redirects
      // run before the next-intl middleware, so the old paths never reach it.
      { source: "/portfolio", destination: "/projecten", permanent: true },
      { source: "/portfolio/:slug", destination: "/projecten/:slug", permanent: true },
      { source: "/en/portfolio", destination: "/en/projects", permanent: true },
      { source: "/en/portfolio/:slug", destination: "/en/projects/:slug", permanent: true },
      // The three discipline pages were replaced by packaged outcomes. Each
      // old URL points at the package that now covers that work; data
      // engineering has no single successor, so it lands on the overview.
      { source: "/diensten/data-engineering", destination: "/diensten", permanent: true },
      {
        source: "/diensten/data-analytics",
        destination: "/diensten/single-source-of-truth",
        permanent: true,
      },
      { source: "/diensten/ai-genai", destination: "/diensten/ai-prototype", permanent: true },
      { source: "/en/services/data-engineering", destination: "/en/services", permanent: true },
      {
        source: "/en/services/data-analytics",
        destination: "/en/services/single-source-of-truth",
        permanent: true,
      },
      {
        source: "/en/services/ai-genai",
        destination: "/en/services/ai-prototype",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Dev convenience: with NEXT_PUBLIC_API_URL unset the browser calls
      // same-origin /api/*, which this rewrite proxies to the local platform
      // server (ruudjuffermans-server on :4000). Production bakes the absolute
      // API origin into the client instead, so this never fires there.
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
