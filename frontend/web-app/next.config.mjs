/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: "incremental",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  env: {
    DATABASE_API_URL: process.env.DATABASE_API_URL,
  },
};

export default nextConfig;
