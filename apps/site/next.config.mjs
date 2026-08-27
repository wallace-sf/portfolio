import { getSecurityHeaders } from '@repo/config';
import createNextIntlPlugin from 'next-intl/plugin';

const SECURITY_HEADERS = getSecurityHeaders({
  isProduction: process.env.NODE_ENV === 'production',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: SECURITY_HEADERS }];
  },
  async rewrites() {
    if (!process.env.BLOG_APP_URL) return [];
    return [
      { source: '/blog', destination: `${process.env.BLOG_APP_URL}/blog` },
      {
        source: '/blog/:path*',
        destination: `${process.env.BLOG_APP_URL}/blog/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CONTACT_NUMBER: process.env.NEXT_PUBLIC_CONTACT_NUMBER,
    NEXT_PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL,
    NEXT_PUBLIC_LINKEDIN_URL: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    NEXT_PUBLIC_RESUME_URL: process.env.NEXT_PUBLIC_RESUME_URL,
    NEXT_PUBLIC_WHATSAPP_URL: process.env.NEXT_PUBLIC_WHATSAPP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  images: {
    qualities: [100, 75],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default createNextIntlPlugin()(nextConfig);
