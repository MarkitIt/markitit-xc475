/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Firebase Functions from Next.js build
  webpack: (config, { isServer }) => {
    // This will completely ignore the fb_functions directory
    config.resolve.alias = {
      ...config.resolve.alias,
      'fb_functions': false,
    };
    
    return config;
  },
  // Explicitly exclude fb_functions directory from being processed
  transpilePackages: [],
  // Exclude specific directories from being watched or processed
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./fb_functions/**/*'],
    },
  },
}

module.exports = nextConfig; 