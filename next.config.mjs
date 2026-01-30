/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // Allows YouTube thumbnails
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
