import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SITE_API_URL: process.env.NEXT_PUBLIC_SITE_API_URL,
  },
};

export default createNextIntlPlugin()(nextConfig);
