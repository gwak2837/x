/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    ...(process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && { removeConsole: true }),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
}

export default nextConfig
