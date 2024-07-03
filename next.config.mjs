/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'admin.bizzcode.site',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
