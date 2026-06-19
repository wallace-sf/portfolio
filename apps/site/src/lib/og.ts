const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

interface OgImageParams {
  title: string;
  subtitle?: string;
  locale?: string;
  page?: string;
}

export function buildOgImageUrl({
  title,
  subtitle,
  locale,
  page,
}: OgImageParams): string {
  const url = new URL('/og', SITE_URL);
  url.searchParams.set('title', title);
  if (subtitle) url.searchParams.set('subtitle', subtitle);
  if (locale) url.searchParams.set('locale', locale);
  if (page) url.searchParams.set('page', page);
  return url.toString();
}

export { SITE_URL };
