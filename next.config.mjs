import { withContentCollections } from "@content-collections/next";
import { get } from "@vercel/edge-config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers() {
    return [
      {
        headers: securityHeaders,
        source: "/(.*)",
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "media0.giphy.com",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "i.scdn.co",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    const manualRedirects = [
      {
        destination: "/writing/ai-manifesto",
        permanent: true,
        source: "/ai",
      },
      {
        destination: "https://github.com/johnie/skills",
        permanent: true,
        source: "/skills",
      },
    ];

    try {
      const edgeConfigRedirects = await get("redirects");
      return [...manualRedirects, ...(edgeConfigRedirects || [])];
    } catch {
      return manualRedirects;
    }
  },
  typedRoutes: true,
};

const ContentSecurityPolicy = `
    default-src 'self' vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live pulse.hjelm.cloud;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://i.scdn.co https://media0.giphy.com https://johnie.se;
    media-src 'none';
    connect-src 'self' https://pulse.hjelm.cloud https://api.spotify.com https://accounts.spotify.com https://vitals.vercel-insights.com;
    font-src 'self' data:;
`;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replaceAll("\n", ""),
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

export default withContentCollections(nextConfig);
