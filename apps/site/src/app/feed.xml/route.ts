import { DEFAULT_LOCALE } from '~/i18n/routing';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function GET(): Response {
  return Response.redirect(`${SITE_URL}/${DEFAULT_LOCALE}/feed.xml`, 301);
}
