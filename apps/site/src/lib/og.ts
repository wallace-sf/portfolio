import { env } from '~/config/env';

interface OgImageParams {
  title: string;
  subtitle?: string;
  locale?: string;
  page?: string;
  jobTitle?: string;
}

export function buildOgImageUrl({
  title,
  subtitle,
  locale,
  page,
  jobTitle,
}: OgImageParams): string {
  const url = new URL('/og', env.siteUrl);
  url.searchParams.set('title', title);
  if (subtitle) url.searchParams.set('subtitle', subtitle);
  if (locale) url.searchParams.set('locale', locale);
  if (page) url.searchParams.set('page', page);
  if (jobTitle) url.searchParams.set('jobTitle', jobTitle);
  return url.toString();
}
