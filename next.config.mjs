/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vikingarmoryblades.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.javehandmade.store',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

