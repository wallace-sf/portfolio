import type { Locale } from '@repo/core/shared';

/**
 * Single source of truth for all `NEXT_PUBLIC_*` environment variables.
 * Each key is a lazy getter so values are read from `process.env` on
 * access rather than frozen at module load.
 */
export const env = {
  /** Canonical site origin used to build absolute URLs (sitemap, feed, OG, JSON-LD). Falls back to localhost outside production. */
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  },

  /** Contact email shown in the Contact section and used as the mailto: target. */
  get contactEmail() {
    return process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  },

  /** Contact phone number, shown formatted and used to build the WhatsApp deep link. */
  get contactNumber() {
    return process.env.NEXT_PUBLIC_CONTACT_NUMBER;
  },

  /** GitHub profile URL, linked from navigation, contact section, and Person JSON-LD sameAs. */
  get githubUrl() {
    return process.env.NEXT_PUBLIC_GITHUB_URL;
  },

  /** LinkedIn profile URL, linked from navigation, contact section, and Person JSON-LD sameAs. */
  get linkedinUrl() {
    return process.env.NEXT_PUBLIC_LINKEDIN_URL;
  },

  /** Pre-filled WhatsApp chat link, currently unused but reserved for future contact flows. */
  get whatsappUrl() {
    return process.env.NEXT_PUBLIC_WHATSAPP_URL;
  },

  /** GA4 Measurement ID; when unset, <GoogleAnalytics> is not rendered. */
  get gaMeasurementId() {
    return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  },

  /** Resume file URL per locale, used by the side navigation's "Resume" link. */
  get resumeUrlByLocale(): Record<Locale, string> {
    return {
      'en-US': process.env.NEXT_PUBLIC_RESUME_URL_EN_US,
      'pt-BR': process.env.NEXT_PUBLIC_RESUME_URL_PT_BR,
      es: process.env.NEXT_PUBLIC_RESUME_URL_ES,
    };
  },
} as const;
