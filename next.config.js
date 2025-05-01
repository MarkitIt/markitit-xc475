/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Firebase Functions from Next.js build
  webpack: (config, { isServer }) => {
    // This will completely ignore the functions directory
    config.resolve.alias = {
      ...config.resolve.alias,
      functions: false,
      'firebase-functions': false,
    };

    return config;
  },
  // Add image domains configuration
  images: {
    domains: [
      "www.eventeny.com",
      "firebasestorage.googleapis.com",
      "img.evbuc.com",
      "cdn.evbuc.com",
    ],
  },
  // Explicitly exclude functions directory from being processed
  transpilePackages: [],
  // Exclude specific directories from being watched or processed
  outputFileTracingExcludes: {
    "*": [
      "node_modules/some-package",
      "functions/**/*",
      "node_modules/firebase-functions/**/*"
    ],
  },
};

module.exports = nextConfig;
