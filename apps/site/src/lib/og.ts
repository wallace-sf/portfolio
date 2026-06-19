const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

interface OgImageParams {
  title: string;
  description?: string;
  image?: string;
}

export function buildOgImageUrl({
  title,
  description,
  image,
}: OgImageParams): string {
  const url = new URL('/og', SITE_URL);
  url.searchParams.set('title', title);
  if (description) url.searchParams.set('description', description);
  if (image) url.searchParams.set('image', image);
  return url.toString();
}

export { SITE_URL };
