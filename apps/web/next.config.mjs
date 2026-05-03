import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CONTACT_NUMBER: process.env.NEXT_PUBLIC_CONTACT_NUMBER,
    NEXT_PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL,
    NEXT_PUBLIC_LINKEDIN_URL: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    NEXT_PUBLIC_RESUME_URL: process.env.NEXT_PUBLIC_RESUME_URL,
    NEXT_PUBLIC_WHATSAPP_URL: process.env.NEXT_PUBLIC_WHATSAPP_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
  },
};

// next-intl v3 plugin injects experimental.turbo for Turbopack alias resolution,
// but Next.js 15+ moved that config to the top-level `turbopack` key.
// We migrate it here to silence the invalid-next-config warning.
const withNextIntl = createNextIntlPlugin();
const config = withNextIntl(nextConfig);

if (config.experimental?.turbo) {
  config.turbopack = { ...config.experimental.turbo, ...config.turbopack };
  delete config.experimental.turbo;
  if (Object.keys(config.experimental).length === 0) {
    delete config.experimental;
  }
}

export default config;
