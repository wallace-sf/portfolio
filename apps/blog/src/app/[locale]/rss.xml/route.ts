import { ListBlogPosts } from '@repo/application/blog';
import type { Locale } from '@repo/core/shared';
import { LOCALES } from '@repo/core/shared';
import { getTranslations } from 'next-intl/server';

import { env } from '~/config/env';
import { getServerContainer } from '~/lib/server/container';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
): Promise<Response> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale });

  if (result.isLeft()) {
    return new Response('Failed to generate RSS feed', { status: 500 });
  }

  const posts = result.value;

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${env.siteUrl}/blog/${locale}/${escapeXml(post.slug)}</link>
      <description>${escapeXml(post.description)}</description>
      <guid isPermaLink="true">${env.siteUrl}/blog/${locale}/${escapeXml(post.slug)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wallace Ferreira — Blog</title>
    <link>${env.siteUrl}/blog/${locale}</link>
    <description>${escapeXml(t('description'))}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${env.siteUrl}/blog/${locale}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
