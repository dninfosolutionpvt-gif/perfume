/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force webpack bundler — disables Turbopack
  // This is required for Tailwind CSS v3 compatibility on Vercel
  webpack: (config) => {
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
