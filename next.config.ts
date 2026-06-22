import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-1.medium.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/contact-centres",
        permanent: true,
      },
      {
        source: "/doctors",
        destination: "/our-doctors",
        permanent: true,
      },
      {
        source: "/at-home-testing",
        destination: "/at-home-fertility-testing",
        permanent: true,
      },
      {
        source: "/bengaluru-aecs-layout",
        destination: "/contact-centres",
        permanent: true,
      },
      {
        source: "/ivf-clinic-bangalore",
        destination: "/contact-centres",
        permanent: true,
      },
      {
        source: "/ivf-centre-bangalore",
        destination: "/contact-centres",
        permanent: true,
      },
      {
        source: "/ivf-center-bangalore",
        destination: "/contact-centres",
        permanent: true,
      },
      {
        source: "/ivf-clinic-bangalore-aecs-layout",
        destination: "/contact-centres",
        permanent: true,
      },
      {
        source: "/ivf-cost-bangalore",
        destination: "/ivf-cost-in-india-2026",
        permanent: true,
      },
      {
        source: "/ivf-cost-bengaluru",
        destination: "/ivf-cost-in-india-2026",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/fertility-insights/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=3600" },
        ],
      },
      {
        source: "/clinical-insights/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
