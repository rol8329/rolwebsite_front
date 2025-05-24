/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.48',
        port: '8000',
        pathname: '/media/**',
      },
    ],
    // Optional: Configure image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // URL rewrites for API and media
  async rewrites() {
    return [
      // Your existing API rewrite
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      // New media rewrites
      {
        source: '/media/:path*',
        destination: 'http://127.0.0.1:8000/media/:path*',
      },
      // Blog API specific rewrite (if needed)
      {
        source: '/blog-api/:path*',
        destination: 'http://127.0.0.1:8000/blog-api/:path*',
      },
    ];
  },

  // Optional: Headers for better CORS handling
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
