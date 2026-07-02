import type { Locale } from '@repo/core/shared';

export const env = {
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  },
  get contactEmail() {
    return process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  },
  get contactNumber() {
    return process.env.NEXT_PUBLIC_CONTACT_NUMBER;
  },
  get githubUrl() {
    return process.env.NEXT_PUBLIC_GITHUB_URL;
  },
  get linkedinUrl() {
    return process.env.NEXT_PUBLIC_LINKEDIN_URL;
  },
  get whatsappUrl() {
    return process.env.NEXT_PUBLIC_WHATSAPP_URL;
  },
  get gaMeasurementId() {
    return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  },
  get resumeUrlByLocale(): Record<Locale, string> {
    return {
      'en-US': process.env.NEXT_PUBLIC_RESUME_URL_EN_US,
      'pt-BR': process.env.NEXT_PUBLIC_RESUME_URL_PT_BR,
      es: process.env.NEXT_PUBLIC_RESUME_URL_ES,
    };
  },
} as const;
