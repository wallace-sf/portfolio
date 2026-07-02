import { env } from '~/config/env';
import { DEFAULT_LOCALE } from '~/i18n/routing';

export const dynamic = 'force-static';

export function GET(): Response {
  return Response.redirect(`${env.siteUrl}/${DEFAULT_LOCALE}/feed.xml`, 301);
}
