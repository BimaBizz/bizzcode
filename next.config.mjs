/** @type {import('next').NextConfig} */
let remotePatterns = [];

if (process.env.COCKPIT_API_URL) {
  try {
    const cockpitUrl = new URL(process.env.COCKPIT_API_URL);
    remotePatterns = [
      {
        protocol: cockpitUrl.protocol.replace(":", ""),
        hostname: cockpitUrl.hostname,
        port: cockpitUrl.port,
        pathname: "/api/assets/image/**",
      },
    ];
  } catch {
    remotePatterns = [];
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
