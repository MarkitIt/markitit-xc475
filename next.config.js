/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Firebase Functions from Next.js build
  webpack: (config, { isServer }) => {
    // Add a rule to exclude fb_functions directory
    config.module.rules.push({
      test: /fb_functions/,
      loader: 'ignore-loader',
    });
    
    return config;
  },
}

module.exports = nextConfig; 