/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // --- 1. REDIRECTS LOGIC ---
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/ShopProductsAdmin',
        permanent: true, // Browser isey hamesha yaad rakhega
      },
    ];
  },

  // --- 2. REMOTE IMAGES CONFIG ---
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
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;