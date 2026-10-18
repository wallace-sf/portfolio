import { GetBlogSearchIndex } from '@repo/application/blog';
import type { Locale } from '@repo/core/shared';
import { LOCALES } from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';

/** One prerendered file per locale; rebuilt with the site, like the RSS feed. */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
): Promise<Response> {
  const { locale } = await params;

  const result = await new GetBlogSearchIndex(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale });

  if (result.isLeft()) {
    return new Response('Failed to generate the search index', {
      status: 500,
    });
  }

  return new Response(JSON.stringify(result.value), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
