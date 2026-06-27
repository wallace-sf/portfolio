import { type Locale } from '@repo/core/shared';

const RESUME_URL_BY_LOCALE: Record<Locale, string> = {
  'en-US': process.env.NEXT_PUBLIC_RESUME_URL_EN_US,
  'pt-BR': process.env.NEXT_PUBLIC_RESUME_URL_PT_BR,
  es: process.env.NEXT_PUBLIC_RESUME_URL_ES,
};

export function getResumeUrl(locale: Locale): string {
  return RESUME_URL_BY_LOCALE[locale];
}
