/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.pixabay.com" }],
  },
  env: {
    DATABASE_API_URL: process.env.DATABASE_API_URL,
  },
};

export default nextConfig;
