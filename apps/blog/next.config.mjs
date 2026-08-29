import { getSecurityHeaders } from '@repo/config';
import createNextIntlPlugin from 'next-intl/plugin';

const SECURITY_HEADERS = getSecurityHeaders({
  isProduction: process.env.NODE_ENV === 'production',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/blog',
  async headers() {
    return [{ source: '/(.*)', headers: SECURITY_HEADERS }];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default createNextIntlPlugin()(nextConfig);
